"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface ConfirmData {
  firstName: string;
  lastName: string;
  canConfirm: boolean;
  alreadyConfirmed: boolean;
  deadlinePassed?: boolean;
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const response = searchParams.get("response"); // "yes" | "no" | null
  const { data: session, isPending } = authClient.useSession();

  const [data, setData] = useState<ConfirmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = token
    ? `/confirm?token=${encodeURIComponent(token)}${response ? `&response=${encodeURIComponent(response)}` : ""}`
    : "/confirm";

  const isSignedIn = !!session?.user;

  async function handleGitHubSignIn() {
    setSignInLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
        errorCallbackURL: "/error",
      });
    } catch (signInError) {
      console.error("GitHub sign in failed:", signInError);
      setSignInLoading(false);
      setError("Failed to start GitHub sign-in. Please try again.");
    }
  }

  async function handleConfirmAttendance() {
    if (!token || confirming) return;

    setConfirming(true);
    setError(null);
    setConfirmMessage(null);

    try {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const json = (await response.json()) as {
        message?: string;
        alreadyConfirmed?: boolean;
      };

      if (!response.ok) {
        throw new Error(json.message ?? "Failed to confirm attendance.");
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              canConfirm: false,
              alreadyConfirmed: true,
            }
          : prev,
      );

      setConfirmMessage(
        json.alreadyConfirmed
          ? "Your attendance was already confirmed."
          : "Attendance confirmed. Check your inbox for additional event details.",
      );
    } catch (confirmError) {
      const message =
        confirmError instanceof Error
          ? confirmError.message
          : "An unexpected error occurred while confirming attendance.";
      setError(message);
    } finally {
      setConfirming(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setError(
        "No confirmation token found. Please use the link from your email.",
      );
      setLoading(false);
      return;
    }

    if (isPending || !isSignedIn) {
      setLoading(false);
      return;
    }

    // Auto-decline when response=no
    if (response === "no") {
      setLoading(true);
      setError(null);

      fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, response: "no" }),
      })
        .then(async (res) => {
          const json = (await res.json()) as {
            message?: string;
            declined?: boolean;
          };
          if (!res.ok) {
            throw new Error(json.message ?? "Failed to process decline.");
          }
          setDeclined(true);
          setData({
            firstName: "",
            lastName: "",
            canConfirm: false,
            alreadyConfirmed: false,
          });
        })
        .catch((err: Error) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/confirm?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const json = (await res.json()) as {
          firstName?: string;
          lastName?: string;
          canConfirm?: boolean;
          alreadyConfirmed?: boolean;
          deadlinePassed?: boolean;
          message?: string;
        };
        if (!res.ok) {
          throw new Error(
            json.message ?? "Failed to load your registration details.",
          );
        }
        setData({
          firstName: json.firstName ?? "",
          lastName: json.lastName ?? "",
          canConfirm: !!json.canConfirm,
          alreadyConfirmed: !!json.alreadyConfirmed,
          deadlinePassed: !!json.deadlinePassed,
        });
      })
      .catch((err: Error) => {
        setError(err.message ?? "An unexpected error occurred.");
      })
      .finally(() => setLoading(false));
  }, [isPending, isSignedIn, token]);

  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#4a67b9] border-t-transparent animate-spin" />
        <p className="text-white text-sm font-mono tracking-widest uppercase">
          Verifying your registration…
        </p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-sm shadow-xl p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 font-mono">
          Sign in to confirm
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          To confirm your RevolutionUC attendance, please sign in with GitHub
          first.
        </p>
        <button
          type="button"
          onClick={handleGitHubSignIn}
          disabled={signInLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#24292f] hover:bg-[#24292f]/90 text-white rounded-lg font-medium text-sm h-12 px-4 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          {signInLoading ? "Signing in..." : "Continue with GitHub"}
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 font-mono">
          Link Invalid
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">{error}</p>
        <p className="text-gray-500 text-xs">
          If you believe this is a mistake, contact us at{" "}
          <a
            href="mailto:info@revolutionuc.com"
            className="text-[#4a67b9] font-semibold hover:underline"
          >
            info@revolutionuc.com
          </a>
          .
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full max-w-xl rounded-sm overflow-hidden shadow-2xl border border-[#228CF6]/30">
      {/* Header */}
      <div className="px-8 py-8 text-center bg-[#151477]">
        <p className="text-xs tracking-[0.3em] uppercase text-[#EDF6FF] font-mono mb-2">
          RevolutionUC 2026
        </p>
        <h1 className="text-3xl font-bold text-white">
          {declined
            ? "Attendance Declined"
            : data.deadlinePassed
              ? "Confirmation Closed"
              : data.alreadyConfirmed
                ? "Attendance Confirmed"
                : "Confirm Attendance"}
        </h1>
        <p className="mt-2 text-[#EDF6FF] text-sm">
          {declined
            ? "You have declined your attendance."
            : data.deadlinePassed
              ? "The confirmation deadline has passed."
              : data.alreadyConfirmed
                ? "Your attendance has already been confirmed."
                : "Confirm your attendance to reserve your spot at RevolutionUC 2026."}
        </p>
      </div>

      {/* Body */}
      <div className="bg-[#EDF6FF] px-8 py-8 space-y-6">
        {/* Name */}
        {!declined && (
          <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-[#151477]">
              {data.firstName} {data.lastName}
            </p>
          </div>
        )}

        <hr className="border-dashed border-[#228CF6]/30" />

        {!declined && !data.deadlinePassed && !data.alreadyConfirmed && data.canConfirm && (
          <button
            type="button"
            onClick={handleConfirmAttendance}
            disabled={confirming}
            className="w-full inline-flex items-center justify-center rounded-full bg-[#228CF6] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#151477] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirming ? "Confirming..." : "Confirm my attendance"}
          </button>
        )}

        {declined && (
          <div className="rounded-2xl bg-[#eab308]/15 border border-[#eab308]/50 p-5 text-sm text-[#151477] space-y-1">
            <p className="font-semibold">You have declined attendance.</p>
            <p className="leading-relaxed text-[#151477]/85">
              Your registration is still active. If you change your mind, contact us at{" "}
              <a href="mailto:info@revolutionuc.com" className="text-[#228CF6] font-semibold hover:underline">
                info@revolutionuc.com
              </a>.
            </p>
          </div>
        )}

        {data.deadlinePassed && !declined && (
          <div className="rounded-2xl bg-[#ef4444]/15 border border-[#ef4444]/50 p-5 text-sm text-[#151477] space-y-1">
            <p className="font-semibold">Confirmation deadline has passed.</p>
            <p className="leading-relaxed text-[#151477]/85">
              The deadline to confirm your attendance was March 25, 2026 at 11:59 PM EST. If you still wish to attend, contact us at{" "}
              <a href="mailto:info@revolutionuc.com" className="text-[#228CF6] font-semibold hover:underline">
                info@revolutionuc.com
              </a>.
            </p>
          </div>
        )}

        {(data.alreadyConfirmed || confirmMessage) && (
          <div className="rounded-2xl bg-[#19E363]/15 border border-[#19E363]/50 p-5 text-sm text-[#151477] space-y-1">
            <p className="font-semibold">You are confirmed.</p>
            <p className="leading-relaxed text-[#151477]/85">
              {confirmMessage ??
                "You're all set. Keep an eye on your inbox for hackathon details."}
            </p>
          </div>
        )}

        <hr className="border-dashed border-[#228CF6]/30" />

        {/* What's next */}
        <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#151477]/70 text-center">
            What's Next?
          </p>
          <ul className="space-y-2 text-sm text-[#151477]/85">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#228CF6]">→</span>
              Watch your inbox for logistics, check-in instructions, and final
              event updates.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#228CF6]">→</span>
              Join our{" "}
              <a
                href="https://discord.gg/bMQnBxYWwC"
                target="_blank"
                rel="noopener noreferrer"
                 className="text-[#228CF6] font-semibold hover:text-[#151477] hover:underline"
              >
                Discord community
              </a>{" "}
              to connect with other hackers.
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#151477] px-8 py-5 text-center space-y-1">
        <p className="text-[#EDF6FF] text-sm font-semibold">
          See you at RevolutionUC!
        </p>
        <p className="text-[#EDF6FF]/85 text-xs">
          Questions?{" "}
          <a
            href="mailto:info@revolutionuc.com"
            className="underline hover:text-[#19E363] transition-colors"
          >
            info@revolutionuc.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 py-16">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-[#4a67b9] border-t-transparent animate-spin" />
            <p className="text-[#9fb3ff] text-sm font-mono tracking-widest uppercase">
              Loading…
            </p>
          </div>
        }
      >
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
