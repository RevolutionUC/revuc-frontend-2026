import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotifyPayload {
  contactName: string;
  email: string;
  organisation: string;
  sponsorshipLevel: string;
  primaryGoal: string;
  sideEvents: string | null;
  expectations: string | null;
  additionalInfo: string | null;
  referral: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderRow(label: string, value: string | null): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`;
}

export async function POST(request: Request) {
  const recipients = (process.env.SPONSOR_NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "No notification recipients configured" },
      { status: 500 },
    );
  }

  const payload: NotifyPayload = await request.json();

  const html = `
    <table cellpadding="0" cellspacing="0">
      ${renderRow("Contact Name", payload.contactName)}
      ${renderRow("Email", payload.email)}
      ${renderRow("Organisation", payload.organisation)}
      ${renderRow("Sponsorship Level", payload.sponsorshipLevel)}
      ${renderRow("Primary Goal", payload.primaryGoal)}
      ${renderRow("Side Events", payload.sideEvents)}
      ${renderRow("Expectations", payload.expectations)}
      ${renderRow("Additional Info", payload.additionalInfo)}
      ${renderRow("Referral", payload.referral)}
    </table>
  `;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: recipients,
    replyTo: payload.email,
    subject: `New Sponsor Interest: ${payload.organisation}`,
    html,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
