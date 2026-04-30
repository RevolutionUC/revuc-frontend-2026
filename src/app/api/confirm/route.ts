import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { auth } from "@/lib/auth";
import { sendAttendanceConfirmedEmail } from "@/lib/email";
import { db } from "@/lib/db";
import { confirmTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type ParticipantStatus = "REGISTERED" | "WAITLISTED" | "CONFIRMED";
type ConfirmActionResponse = "yes" | "no";
type ParticipantRecord = {
  user_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  status: ParticipantStatus;
};

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

function unexpectedErrorResponse() {
  return NextResponse.json(
    { message: "An unexpected error occurred. Please try again later." },
    { status: 500 },
  );
}

async function fetchParticipantForConfirm(
  supabase: Awaited<ReturnType<typeof createClient>>,
  participantId: string,
  token: string,
  method: "GET" | "POST",
): Promise<{ participant: ParticipantRecord } | { response: NextResponse }> {
  const { data, error } = await supabase
    .from("participants")
    .select("user_id, first_name, last_name, email, status")
    .eq("user_id", participantId)
    .single();

  if (error || !data) {
    console.error(`Confirm ${method} participant lookup failed`, {
      token: maskToken(token),
      hasParticipant: !!data,
      error,
    });
    return {
      response: NextResponse.json(
        { message: "Invalid or expired confirmation link." },
        { status: 404 },
      ),
    };
  }

  return { participant: data as ParticipantRecord };
}

function getGetStatusResponse(participant: ParticipantRecord): NextResponse | null {
  if (participant.status === "WAITLISTED") {
    return NextResponse.json(
      {
        message:
          "This confirmation link is not available for your registration right now. Please watch your inbox for updates.",
      },
      { status: 403 },
    );
  }

  if (participant.status === "CONFIRMED") {
    return NextResponse.json({
      firstName: participant.first_name,
      lastName: participant.last_name,
      canConfirm: false,
      alreadyConfirmed: true,
    });
  }

  if (participant.status !== "REGISTERED") {
    return NextResponse.json(
      { message: "This confirmation link is not valid anymore." },
      { status: 400 },
    );
  }

  return null;
}

function getPostStatusResponse(participant: ParticipantRecord): NextResponse | null {
  if (participant.status === "WAITLISTED") {
    return NextResponse.json(
      {
        message:
          "This registration is currently waitlisted and cannot be confirmed from this link.",
      },
      { status: 403 },
    );
  }

  if (participant.status === "CONFIRMED") {
    return NextResponse.json({
      message: "Attendance already confirmed.",
      alreadyConfirmed: true,
    });
  }

  if (participant.status !== "REGISTERED") {
    return NextResponse.json(
      { message: "This confirmation link is not valid anymore." },
      { status: 400 },
    );
  }

  return null;
}

async function markConfirmTokenUsed(token: string) {
  await db
    .update(confirmTokens)
    .set({ usedAt: new Date() })
    .where(eq(confirmTokens.token, token));
}

async function markParticipantConfirmed(
  supabase: Awaited<ReturnType<typeof createClient>>,
  participantId: string,
  token: string,
) {
  const { error } = await supabase
    .from("participants")
    .update({ status: "CONFIRMED" })
    .eq("user_id", participantId);

  if (error) {
    console.error("Confirm POST participant update failed", {
      token: maskToken(token),
      error,
    });
    throw error;
  }
}

async function parsePostBody(
  request: NextRequest,
): Promise<
  | { token: string | null; response: ConfirmActionResponse }
  | { errorResponse: NextResponse }
> {
  try {
    const body = (await request.json()) as {
      token?: string;
      response?: ConfirmActionResponse;
    };

    return {
      token: normalizeToken(body.token ?? null),
      response: body.response === "no" ? "no" : "yes",
    };
  } catch {
    return {
      errorResponse: NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 },
      ),
    };
  }
}

async function resolveParticipantContext(
  token: string | null,
  method: "GET" | "POST",
): Promise<
  | { context: ConfirmRequestContext; participant: ParticipantRecord }
  | { response: NextResponse }
> {
  const contextResult = await resolveConfirmContext(token);
  if ("response" in contextResult) {
    return contextResult;
  }

  const { context } = contextResult;
  const participantResult = await fetchParticipantForConfirm(
    context.supabase,
    context.participantId,
    context.token,
    method,
  );
  if ("response" in participantResult) {
    return participantResult;
  }

  return { context, participant: participantResult.participant };
}

async function handlePostConfirmationAction(
  context: ConfirmRequestContext,
  participant: ParticipantRecord,
  response: ConfirmActionResponse,
) {
  await markConfirmTokenUsed(context.token);

  if (response === "no") {
    return NextResponse.json({
      message: "You have declined attendance. Your registration remains active.",
      declined: true,
    });
  }

  await markParticipantConfirmed(context.supabase, context.participantId, context.token);
  sendAttendanceConfirmedEmail(participant.email, participant.first_name).catch(
    (emailError) => {
      console.error("Failed to send attendance confirmation email:", emailError);
    },
  );

  return NextResponse.json({
    message: "Attendance confirmed successfully.",
    alreadyConfirmed: false,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = normalizeToken(searchParams.get("token"));

  const user = await requireAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  }

  try {
    const participantContextResult = await resolveParticipantContext(token, "GET");
    if ("response" in participantContextResult) {
      return participantContextResult.response;
    }
    const { participant } = participantContextResult;

    const statusResponse = getGetStatusResponse(participant);
    if (statusResponse) {
      return statusResponse;
    }

    return NextResponse.json({
      firstName: participant.first_name,
      lastName: participant.last_name,
      canConfirm: true,
      alreadyConfirmed: false,
    });
  } catch (err) {
    console.error("Confirm route error:", err);
    return unexpectedErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  }

  const bodyResult = await parsePostBody(request);
  if ("errorResponse" in bodyResult) {
    return bodyResult.errorResponse;
  }
  const { token, response } = bodyResult;

  try {
    const participantContextResult = await resolveParticipantContext(token, "POST");
    if ("response" in participantContextResult) {
      return participantContextResult.response;
    }
    const { context, participant } = participantContextResult;

    const statusResponse = getPostStatusResponse(participant);
    if (statusResponse) {
      return statusResponse;
    }

    return handlePostConfirmationAction(context, participant, response);
  } catch (err) {
    console.error("Confirm update route error:", err);
    return unexpectedErrorResponse();
  }
}
