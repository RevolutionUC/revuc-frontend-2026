"use client";

import { useState } from "react";
import { InputField } from "@/components/ui/InputField";
import { supabase } from "@/lib/supabase";

const SPONSORSHIP_TIERS = [
  { name: "Bronze", amount: "~$1k", gradient: "linear-gradient(to bottom, #CD7F32, #B8750A)" },
  { name: "Silver", amount: "~$1k-3k", gradient: "linear-gradient(to bottom, #C0C0C0, #A8A8A8)" },
  { name: "Gold", amount: "~$3k-5k", gradient: "linear-gradient(to bottom, #FFD700, #D4A500)" },
  { name: "Platinum", amount: "~$5k+", gradient: "linear-gradient(to bottom, #E5E9F2, #C5D4E3)" },
];

const PRIMARY_GOALS = [
  "Recruit Top Talent",
  "Build Brand Loyalty",
  "Promote Specific Products or Services",
  "Gain Fresh Perspectives on Business Challenges",
  "Gather Insights on Emerging Technologies",
  "Engage with Local Community",
  "Support Diversity and Inclusion in Tech",
  "Support innovation and education in tech",
  "Demonstrate corporate social responsibility",
  "Foster relationships with emerging tech communities",
  "Teach Specific Skills to Emerging Talent",
  "Other",
];

const SIDE_EVENTS = [
  "Prize Category",
  "Capture The Flag",
  "Workshop",
  "Coding Escape Room",
  "Fun/Networking Event",
  "Other",
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

interface Errors {
  contactName?: string;
  email?: string;
  organisation?: string;
  sponsorshipTier?: string;
  primaryGoal?: string;
}

export default function SponsorInterestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [sponsorshipTier, setSponsorshipTier] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [otherGoal, setOtherGoal] = useState("");
  const [selectedSideEvents, setSelectedSideEvents] = useState<string[]>([]);
  const [otherSideEvent, setOtherSideEvent] = useState("");
  const [expectations, setExpectations] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [referral, setReferral] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
    if (errors.primaryGoal) setErrors((prev) => ({ ...prev, primaryGoal: undefined }));
  }

  function toggleSideEvent(event: string) {
    setSelectedSideEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  }

  function handleEmailBlur() {
    if (email && !isValidEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email (e.g. name@domain.com)",
      }));
    }
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};

    if (!contactName.trim()) next.contactName = "Contact name is required";
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!isValidEmail(email)) {
      next.email = "Please enter a valid email (e.g. name@domain.com)";
    }
    if (!organisation.trim()) next.organisation = "Organisation name is required";
    if (!sponsorshipTier) next.sponsorshipTier = "Please select a sponsorship tier";
    if (selectedGoals.length === 0) next.primaryGoal = "Please select at least one goal";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const tierData = SPONSORSHIP_TIERS.find((t) => t.name === sponsorshipTier);
    const tierValue = tierData ? `${tierData.name} - ${tierData.amount}` : sponsorshipTier;

    const goalsValue = selectedGoals
      .map((g) => (g === "Other" && otherGoal.trim() ? `Other: ${otherGoal.trim()}` : g))
      .join(", ");

    const sideEventsValue = selectedSideEvents.length > 0
      ? selectedSideEvents
          .map((e) => (e === "Other" && otherSideEvent.trim() ? `Other: ${otherSideEvent.trim()}` : e))
          .join(", ")
      : null;

    const { error: dbError } = await supabase.from("sponsor_interest").insert({
      contact_name: contactName.trim(),
      email: email.trim(),
      organisation: organisation.trim(),
      sponsorship_level: tierValue,
      primary_goal: goalsValue,
      side_events: sideEventsValue,
      expectations: expectations.trim() || null,
      additional_info: additionalInfo.trim() || null,
      referral: referral.trim() || null,
    });

    if (dbError) {
      setErrors({ email: "Something went wrong, please try again." });
      return;
    }

    setSubmitted(true);

    /*Send sponsor interest notification email*/
    fetch("/api/sponsor-interest/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: contactName.trim(),
        email: email.trim(),
        organisation: organisation.trim(),
        sponsorshipLevel: tierValue,
        primaryGoal: goalsValue,
        sideEvents: sideEventsValue,
        expectations: expectations.trim() || null,
        additionalInfo: additionalInfo.trim() || null,
        referral: referral.trim() || null,
      }),
    }).catch((err) => {
      console.error("Failed to send sponsor interest notification email", err);
    });
  }

  return (
    <div className="relative min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
      {/* Decorative background blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#228CF6]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#19E363]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-[#228CF6] mb-2">
            RevolutionUC
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#151477] leading-tight">
            Sponsor Interest{" "}
            <span className="relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-full after:bg-[#19E363]">
              Form
            </span>
          </h1>
          <p className="mt-4 text-[#151477]/70 text-base sm:text-lg">
            Interested in sponsoring RevolutionUC? Let us know and we&apos;ll be in touch.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#B7D9FF] bg-white/90 shadow-xl backdrop-blur-sm px-6 py-8 sm:px-10 sm:py-10">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#19E363]/20">
                <svg
                  className="h-8 w-8 text-[#19E363]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#151477]">Thank you!</h2>
              <p className="text-[#151477]/70">
                We&apos;ve received your interest. Our team will reach out soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              <InputField
                name="contactName"
                label="Primary Contact Name"
                placeholder="e.g. Jane Smith"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (errors.contactName) setErrors((prev) => ({ ...prev, contactName: undefined }));
                }}
                error={errors.contactName}
                required
              />

              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="e.g. jane@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={handleEmailBlur}
                error={errors.email}
                required
              />

              <InputField
                name="organisation"
                label="Interested Organisation"
                placeholder="e.g. Acme Corp"
                value={organisation}
                onChange={(e) => {
                  setOrganisation(e.target.value);
                  if (errors.organisation) setErrors((prev) => ({ ...prev, organisation: undefined }));
                }}
                error={errors.organisation}
                required
              />

              <div>
                <p className="mb-3 block font-semibold text-gray-900">
                  Sponsorship Tier<span className="text-red-600">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {SPONSORSHIP_TIERS.map((tier) => (
                    <label
                      key={tier.name}
                      style={{ background: tier.gradient }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        sponsorshipTier === tier.name
                          ? "border-gray-900 ring-2 ring-offset-1 ring-gray-900"
                          : "border-gray-400/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sponsorshipTier"
                        value={tier.name}
                        checked={sponsorshipTier === tier.name}
                        onChange={() => {
                          setSponsorshipTier(tier.name);
                          if (errors.sponsorshipTier) setErrors((prev) => ({ ...prev, sponsorshipTier: undefined }));
                        }}
                        className="h-4 w-4 accent-[#151477]"
                      />
                      <span className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-gray-950">
                          {tier.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {tier.amount}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.sponsorshipTier && (
                  <p className="mt-2 text-sm text-red-600">{errors.sponsorshipTier}</p>
                )}
              </div>

              <div>
                <p className="mb-2 block font-semibold text-gray-900">
                  Primary Goal as Sponsor<span className="text-red-600">*</span>
                </p>
                <div className="flex flex-col gap-2">
                  {PRIMARY_GOALS.map((goal) => (
                    <label key={goal} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGoals.includes(goal)}
                        onChange={() => toggleGoal(goal)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        {goal === "Other" ? "Other:" : goal}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedGoals.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={otherGoal}
                    onChange={(e) => setOtherGoal(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                )}
                {errors.primaryGoal && (
                  <p className="mt-1 text-sm text-red-600">{errors.primaryGoal}</p>
                )}
              </div>

              {/* Side events — optional */}
              <div>
                <p className="mb-1 block font-semibold text-gray-900">
                  Are you interested in sponsoring any of these side events?
                </p>
                <p className="mb-2 text-xs text-gray-500">
                  Prize Category: Set a specific challenge for hackers. Outsource your most pressing
                  issues to over 300 of the brightest young minds.
                </p>
                <div className="flex flex-col gap-2">
                  {SIDE_EVENTS.map((event) => (
                    <label key={event} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSideEvents.includes(event)}
                        onChange={() => toggleSideEvent(event)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#151477]"
                      />
                      <span className="text-sm text-gray-900">
                        {event === "Other" ? "Other:" : event}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedSideEvents.includes("Other") && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    value={otherSideEvent}
                    onChange={(e) => setOtherSideEvent(e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                )}
              </div>

              {/* Expectations — optional */}
              <div>
                <label htmlFor="expectations" className="mb-1 block font-semibold text-gray-900">
                  Do you have any specific expectations and goals as a sponsor at RevolutionUC
                  Hackathon 2027 that you want us to know?
                </label>
                <textarea
                  id="expectations"
                  name="expectations"
                  value={expectations}
                  onChange={(e) => setExpectations(e.target.value)}
                  placeholder="Share your expectations..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
                />
              </div>

              {/* Additional info — optional */}
              <div>
                <label htmlFor="additionalInfo" className="mb-1 block font-semibold text-gray-900">
                  Please provide any additional information or comments you would like us to consider
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any additional comments..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
                />
              </div>

              {/* Referral — optional */}
              <div>
                <label htmlFor="referral" className="mb-1 block font-semibold text-gray-900">
                  Did anyone refer you to fill out this form? If so, put their name here!
                </label>
                <input
                  id="referral"
                  type="text"
                  name="referral"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="Referral name (optional)"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-md border-2 border-[#19E363] bg-[#151477] px-6 py-3 font-semibold text-[#EDF6FF] transition-all duration-200 hover:bg-[#19E363] hover:text-[#151477] active:scale-[0.98]"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
