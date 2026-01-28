"use client";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { InputField, SelectField, Checkbox, CheckboxGroup } from "@/components/ui";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  EDUCATION_LEVELS,
  MAJORS,
  GENDERS,
  SHIRT_SIZES,
  HACKATHON_COUNTS,
  COUNTRIES,
  RACE_ETHNICITY_OPTIONS,
  REFERRAL_SOURCES,
} from "@/lib/registration-data";

type NotificationType = "success" | "error" | null;

interface Notification {
  message: string;
  type: NotificationType;
}

export default function BoardingPass() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [notification, setNotification] = useState<Notification>({
    message: "",
    type: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, label: "Basic Info" },
    { id: 1, label: "School & Demographics" },
    { id: 2, label: "Logistics & Links" },
  ] as const;

  // Check for openForm query parameter and auto-open form (only once after sign-in)
  useEffect(() => {
    const openForm = searchParams.get("openForm");
    if (openForm === "true") {
      // Only auto-open if form hasn't been shown yet
      if (!showForm) {
        setShowForm(true);
      }
      // Scroll to the section smoothly after a short delay to ensure component is mounted
      setTimeout(() => {
        const element = document.getElementById("boarding-pass");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
      // Remove the query parameter from URL after handling it
      const url = new URL(window.location.href);
      url.searchParams.delete("openForm");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, showForm]);

  // Close form when user signs out
  useEffect(() => {
    if (!session?.user && showForm) {
      setShowForm(false);
      // Reset form state
      setEmail("");
      setConfirmEmail("");
      setAge("");
      setEmailError("");
      setAgeError("");
      setCurrentStep(0);
      setNotification({ message: "", type: null });
    }
  }, [session, showForm]);

  function validateEmails(primary: string, confirm: string) {
    if (primary && confirm && primary !== confirm) {
      setEmailError("Emails do not match");
    } else {
      setEmailError("");
    }
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    validateEmails(value, confirmEmail);
  }

  function handleConfirmEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setConfirmEmail(value);
    validateEmails(email, value);
  }

  function handleAgeChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    // Allow empty value for user to clear the field
    if (value === "") {
      setAge("");
      setAgeError("");
      return;
    }

    // Parse the number
    const numValue = Number(value);

    // Check if it's a valid number
    if (isNaN(numValue)) {
      setAgeError("Age must be a valid number");
      setAge(value); // Keep the invalid input so user can see what they typed
      return;
    }

    // Prevent negative values
    if (numValue < 0) {
      setAgeError("Age cannot be negative");
      setAge("18"); // Set to minimum valid value
      return;
    }

    // Enforce minimum age of 18
    if (numValue < 18) {
      setAgeError("Age must be at least 18");
      setAge("18"); // Set to minimum valid value
      return;
    }

    // Valid age
    setAge(value);
    setAgeError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (emailError || ageError || isSubmitting) return;

    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/registration/api", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const message = Array.isArray(data.message) ? data.message.join("\n") : data.message;

      if (response.ok) {
        setNotification({ message, type: "success" });
        form.reset();
        setEmail("");
        setConfirmEmail("");
        setAge("");
        setAgeError("");
        setCurrentStep(0);
        setShowForm(false);
      } else {
        setNotification({ message, type: "error" });
      }
    } catch {
      setNotification({
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToNextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function goToPreviousStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  async function handleBoardingPassClick() {
    // Check if user is authenticated
    if (!session?.user) {
      // Redirect to sign-in page with callback to open form
      router.push("/sign-in?callbackUrl=/?openForm=true");
      return;
    }
    // User is authenticated, show the form
    setShowForm(true);
  }

  return (
    <div id="boarding-pass" className="section w-full min-h-screen relative overflow-hidden">
      <div className="relative z-20 w-full h-full flex items-start justify-center pt-[10%] px-4 sm:px-6 lg:px-8">
        <div
          className={`w-full max-w-4xl rounded-3xl ${
            showForm
              ? "bg-white/90 backdrop-blur-sm shadow-xl p-6 sm:p-8 lg:p-10"
              : "p-0 shadow-none bg-transparent"
          }`}
        >
          {!showForm ? (
            <>
              <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-gray-900">
                Click the boarding pass to register
              </p>
              <button
                type="button"
                className="group mb-4 w-full overflow-visible focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
                onClick={handleBoardingPassClick}
              >
                <div className="relative w-full h-64 sm:h-80 md:h-96 transition-all duration-300 ease-out group-hover:scale-105 group-hover:cursor-pointer">
                  <Image
                    src="/boarding_pass.webp"
                    alt="RevolutionUC 2026 Boarding Pass - Click to Register"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </button>
            </>
          ) : (
            <div className="mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Register
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-2xl">
                Secure your spot at RevolutionUC 2026. Fill out the form and we&apos;ll send you a
                confirmation email and QR code.
              </p>
            </div>
          )}

          {notification.type && (
            <div
              className={`mb-6 rounded-lg p-4 text-white ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{notification.message}</pre>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {steps[currentStep].label}
                  </p>
                </div>
                <div className="flex gap-1">
                  {steps.map((step) => (
                    <span
                      key={step.id}
                      className={`h-1.5 w-8 rounded-full transition ${
                        step.id <= currentStep ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className={currentStep === 0 ? "space-y-6" : "hidden"}>
                {/* Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField name="firstName" label="First Name" placeholder="Mark" required />
                  <InputField name="lastName" label="Last Name" placeholder="Zuckerberg" required />
                </div>

                {/* Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <InputField
                    name="emailConfirmed"
                    label="Confirm Email"
                    type="email"
                    placeholder="you@example.com"
                    value={confirmEmail}
                    onChange={handleConfirmEmailChange}
                    error={emailError}
                    required
                  />
                </div>

                {/* Country & Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField name="country" label="Country" options={COUNTRIES} required />
                  <InputField
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className={currentStep === 1 ? "space-y-6" : "hidden"}>
                {/* School */}
                <InputField
                  name="school"
                  label="School"
                  placeholder="University of Cincinnati"
                  required
                />

                {/* Education & Major */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    name="educationLevel"
                    label="Education Level"
                    options={EDUCATION_LEVELS}
                    required
                  />
                  <SelectField name="major" label="Major" options={MAJORS} required />
                </div>

                {/* Age & Gender */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    name="age"
                    label="Age"
                    type="number"
                    placeholder="18"
                    min={18}
                    value={age}
                    onChange={handleAgeChange}
                    error={ageError}
                    required
                  />
                  <SelectField name="gender" label="Gender" options={GENDERS} required />
                </div>

                {/* Graduation Year */}
                {/*<InputField
                  name="graduationYear"
                  label="Graduation Year"
                  type="number"
                  placeholder="2030"
                  required
                />*/}

                {/* Race/Ethnicity */}
                <CheckboxGroup
                  name="raceEthnicity"
                  label="Race/Ethnicity"
                  options={RACE_ETHNICITY_OPTIONS}
                  required
                />
              </div>

              <div className={currentStep === 2 ? "space-y-6" : "hidden"}>
                {/* Shirt Size & Hackathons */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField name="shirtSize" label="Shirt Size" options={SHIRT_SIZES} required />
                  <SelectField
                    name="hackathons"
                    label="Hackathons Attended"
                    options={HACKATHON_COUNTS}
                    required
                  />
                </div>

                {/* Graduation Year & Diet Restrictions */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    name="dietRestrictions"
                    label="Dietary Restrictions"
                    placeholder="None"
                  />
                  <InputField name="githubUsername" label="GitHub Username" placeholder="octocat" />
                </div>

                {/* Optional: LinkedIn */}
                <InputField
                  name="linkedInURL"
                  label="LinkedIn URL"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                />

                {/* Resume */}
                <div>
                  <label htmlFor="resume" className="mb-1 block font-semibold text-gray-900">
                    Resume
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-gray-200 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-300"
                  />
                </div>

                {/* Referral Source */}
                <CheckboxGroup
                  name="referralSource"
                  label="How did you hear about RevUC?"
                  options={REFERRAL_SOURCES}
                />

                {/* Agreements */}
                <fieldset className="space-y-3">
                  <legend className="font-semibold text-gray-900">Agreements</legend>
                  <Checkbox name="waiver" required>
                    I agree to the{" "}
                    <a href="/waiver" className="text-red-700 underline hover:text-red-800">
                      RevolutionUC Waiver
                    </a>
                  </Checkbox>
                  <Checkbox name="dataSharing" required>
                    I agree to MLH Data Sharing
                  </Checkbox>
                  <Checkbox name="codeOfConduct" required>
                    I agree to the{" "}
                    <a
                      href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 underline hover:text-red-800"
                    >
                      MLH Code of Conduct
                    </a>
                  </Checkbox>
                </fieldset>
              </div>

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPreviousStep();
                      }}
                      className={`bg-gray-900 text-white hover:bg-gray-800 ${
                        currentStep === 0 ? "pointer-events-none opacity-40" : ""
                      }`}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    {currentStep < steps.length - 1 ? (
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToNextStep();
                        }}
                        className={`bg-gray-900 text-white hover:bg-gray-800 ${
                          emailError || ageError ? "pointer-events-none opacity-40" : ""
                        }`}
                      />
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !!emailError || !!ageError}
                        className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Register"}
                      </button>
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
