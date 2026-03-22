import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { auth } from "@/lib/auth";
import { sendAttendanceConfirmedEmail } from "@/lib/email";

type ParticipantStatus = "REGISTERED" | "WAITLISTED" | "CONFIRMED";

function maskToken(token: string | null): string {
  if (!token) return "<missing>";
  if (token.length <= 8) return token;
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

async function requireAuthenticatedUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

function normalizeToken(token: string | null): string | null {
  if (!token) return null;
  const trimmedToken = token.trim();
  return trimmedToken.length > 0 ? trimmedToken : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = normalizeToken(searchParams.get("token"));

  const user = await requireAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  }

  if (!token) {
    return NextResponse.json(
      { message: "No confirmation token provided." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("participants")
      .select("user_id, first_name, last_name, email, status")
      .eq("user_id", token)
      .single();

    if (error || !data) {
      console.error("Confirm GET participant lookup failed", {
        token: maskToken(token),
        hasData: !!data,
        error,
      });
      return NextResponse.json(
        { message: "Invalid or expired confirmation link." },
        { status: 404 },
      );
    }

    const status = data.status as ParticipantStatus;

    if (status === "WAITLISTED") {
      return NextResponse.json(
        {
          message:
            "This confirmation link is not available for your registration right now. Please watch your inbox for updates.",
        },
        { status: 403 },
      );
    }

    if (status === "CONFIRMED") {
      return NextResponse.json({
        firstName: data.first_name,
        lastName: data.last_name,
        canConfirm: false,
        alreadyConfirmed: true,
      });
    }

    if (status !== "REGISTERED") {
      return NextResponse.json(
        { message: "This confirmation link is not valid anymore." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      firstName: data.first_name,
      lastName: data.last_name,
      canConfirm: true,
      alreadyConfirmed: false,
    });
  } catch (err) {
    console.error("Confirm route error:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  }

  let token: string | null = null;

  try {
    const body = (await request.json()) as { token?: string };
    token = normalizeToken(body.token ?? null);
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!token) {
    return NextResponse.json(
      { message: "No confirmation token provided." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .select("user_id, first_name, email, status")
      .eq("user_id", token)
      .single();

    if (participantError || !participant) {
      console.error("Confirm POST participant lookup failed", {
        token: maskToken(token),
        hasParticipant: !!participant,
        error: participantError,
      });
      return NextResponse.json(
        { message: "Invalid or expired confirmation link." },
        { status: 404 },
      );
    }

    const status = participant.status as ParticipantStatus;

    if (status === "WAITLISTED") {
      return NextResponse.json(
        {
          message:
            "This registration is currently waitlisted and cannot be confirmed from this link.",
        },
        { status: 403 },
      );
    }

    if (status === "CONFIRMED") {
      return NextResponse.json({
        message: "Attendance already confirmed.",
        alreadyConfirmed: true,
      });
    }

    if (status !== "REGISTERED") {
      return NextResponse.json(
        { message: "This confirmation link is not valid anymore." },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabase
      .from("participants")
      .update({ status: "CONFIRMED" })
      .eq("user_id", token);

    if (updateError) {
      console.error("Confirm POST participant update failed", {
        token: maskToken(token),
        error: updateError,
      });
      throw updateError;
    }

    sendAttendanceConfirmedEmail(participant.email, participant.first_name).catch(
      (emailError) => {
        console.error("Failed to send attendance confirmation email:", emailError);
      },
    );

    return NextResponse.json({
      message: "Attendance confirmed successfully.",
      alreadyConfirmed: false,
    });
  } catch (err) {
    console.error("Confirm update route error:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}
