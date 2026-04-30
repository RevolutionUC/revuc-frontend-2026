import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { auth } from "@/lib/auth";
import { sendAttendanceConfirmedEmail } from "@/lib/email";
import { db } from "@/lib/db";
import { confirmTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

async function resolveConfirmToken(
  token: string,
): Promise<{ participantId: string } | { error: string; status: number }> {
  const [record] = await db
    .select({
      id: confirmTokens.id,
      participantId: confirmTokens.participantId,
      expiresAt: confirmTokens.expiresAt,
      usedAt: confirmTokens.usedAt,
    })
    .from(confirmTokens)
    .where(eq(confirmTokens.token, token))
    .limit(1);

  if (!record) {
    return { error: "Invalid or expired confirmation link.", status: 404 };
  }

  if (record.usedAt) {
    return { error: "This confirmation link has already been used.", status: 400 };
  }

  if (new Date(record.expiresAt) < new Date()) {
    return { error: "This confirmation link has expired.", status: 400 };
  }

  return { participantId: record.participantId };
}

type ConfirmRequestContext = {
  token: string;
  participantId: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

async function resolveConfirmContext(
  token: string | null,
): Promise<{ context: ConfirmRequestContext } | { response: NextResponse }> {
  if (!token) {
    return {
      response: NextResponse.json(
        { message: "No confirmation token provided." },
        { status: 400 },
      ),
    };
  }

  const resolved = await resolveConfirmToken(token);
  if ("error" in resolved) {
    return {
      response: NextResponse.json(
        { message: resolved.error },
        { status: resolved.status },
      ),
    };
  }

  return {
    context: {
      token,
      participantId: resolved.participantId,
      supabase: await createClient(),
    },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = normalizeToken(searchParams.get("token"));

  const user = await requireAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  }

  try {
    const contextResult = await resolveConfirmContext(token);
    if ("response" in contextResult) {
      return contextResult.response;
    }
    const { participantId, supabase } = contextResult.context;

    const { data, error } = await supabase
      .from("participants")
      .select("user_id, first_name, last_name, email, status")
      .eq("user_id", participantId)
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
  let response: "yes" | "no" = "yes";

  try {
    const body = (await request.json()) as { token?: string; response?: "yes" | "no" };
    token = normalizeToken(body.token ?? null);
    if (body.response === "no") {
      response = "no";
    }
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  try {
    const contextResult = await resolveConfirmContext(token);
    if ("response" in contextResult) {
      return contextResult.response;
    }
    const { participantId, supabase } = contextResult.context;

    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .select("user_id, first_name, email, status")
      .eq("user_id", participantId)
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

    // Mark the token as used so it cannot be reused
    await db
      .update(confirmTokens)
      .set({ usedAt: new Date() })
      .where(eq(confirmTokens.token, token));

    if (response === "no") {
      return NextResponse.json({
        message: "You have declined attendance. Your registration remains active.",
        declined: true,
      });
    }

    const { error: updateError } = await supabase
      .from("participants")
      .update({ status: "CONFIRMED" })
      .eq("user_id", participantId);

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
