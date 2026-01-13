import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import QRCode from "qrcode";
import type { RegistrationData } from "@/app/registration/types";
import { randomUUID } from "crypto";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const data: RegistrationData = extractRegistrationData(formData);

    // Validate required fields
    const errors: string[] = validateRegistrationData(data, formData);

    // If there are validation errors, return them
    if (errors.length > 0) {
      return NextResponse.json({ message: errors }, { status: 400 });
    }

    // Create Supabase client
    const supabaseClient = await createClient();

    // Saving registration data to database
    const response = await saveRegistrationToDatabase(supabaseClient, data);

    if (response.error) {
      if (response.error.code === "23505") {
        return NextResponse.json(
          { message: "This email is already registered." },
          { status: 400 },
        );
      }
      throw response.error;
    }
    console.log("uuid:", response.uuid, "error:", response.error);

    // Checks and uploads resume if any
    const resume = formData.get("resume") as File | null;
    const resumeUrl: string | null = await uploadResumeIfAny(
      supabaseClient,
      resume,
      data.email,
    );

    // Generate QR code
    if (response.uuid) {
      const qrCodeBase64 = await generateQRCode(response.uuid);

      // Try to update, but don't fail the request if it errors
      const updateError = await updateRegistrationWithQRCodeAndResume(
        supabaseClient,
        response.uuid,
        qrCodeBase64,
        resumeUrl,
      );

      if (updateError) {
        console.error(
          "Failed to update QR/resume, but registration succeeded:",
          updateError,
        );
      }

      // Send confirmation email (don't await - fire and forget)
      sendConfirmationEmail(data.email, data.firstName).catch((err) =>
        console.error("Failed to send confirmation email:", err),
      );

      // Always return success since registration completed
      return NextResponse.json(
        {
          message:
            "Registration successful! Check your email for confirmation.",
          data: {
            email: data.email,
            uuid: response.uuid,
            qrCode: `data:image/png;base64,${qrCodeBase64}`,
          },
        },
        { status: 200 },
      );
    }

    throw new Error("Failed to generate QR code: missing UUID");
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 },
    );
  }
}

// --  Helper functions --

function extractRegistrationData(formData: FormData): RegistrationData {
  return {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    school: formData.get("school") as string,
    country: formData.get("country") as string,
    educationLevel: formData.get("educationLevel") as string,
    major: formData.get("major") as string,
    age: formData.get("age") as string,
    gender: formData.get("gender") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    shirtSize: formData.get("shirtSize") as string,
    hackathons: formData.get("hackathons") as string,
    graduationYear: formData.get("graduationYear") as string,
    githubUsername: (formData.get("githubUsername") as string) || undefined,
    linkedInURL: (formData.get("linkedInURL") as string) || undefined,
    dietRestrictions: (formData.get("dietRestrictions") as string) || undefined,
    raceEthnicity: formData.getAll("raceEthnicity") as string[],
    referralSource: formData.getAll("referralSource") as string[],
  };
}

function validateRegistrationData(
  data: RegistrationData,
  formData: FormData,
): string[] {
  const errors: string[] = [];
  const requiredFields: (keyof RegistrationData)[] = [
    "firstName",
    "lastName",
    "email",
    "school",
    "country",
    "educationLevel",
    "major",
    "age",
    "gender",
    "phoneNumber",
    "shirtSize",
    "hackathons",
    "graduationYear",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  }

  // Validate race/ethnicity (at least one selection required)
  if (data.raceEthnicity.length === 0) {
    errors.push("Please select at least one race/ethnicity option");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push("Invalid email format");
  }

  // Validate age
  const age = Number.parseInt(data.age, 10);
  if (Number.isNaN(age) || age < 13 || age > 100) {
    errors.push("Age must be between 13 and 100");
  }

  // Validate graduation year (simple sanity check)
  const gradYear = Number.parseInt(data.graduationYear, 10);
  const currentYear = new Date().getFullYear();
  if (
    Number.isNaN(gradYear) ||
    gradYear < currentYear ||
    gradYear > currentYear + 10
  ) {
    errors.push("Graduation year must be within a reasonable range");
  }

  errors.push(...checkAgreements(formData));
  return errors;
}

function checkAgreements(formData: FormData): string[] {
  const errors: string[] = [];
  const waiver = formData.get("waiver");
  const dataSharing = formData.get("dataSharing");
  const codeOfConduct = formData.get("codeOfConduct");

  if (!waiver) errors.push("You must agree to the waiver");
  if (!dataSharing) errors.push("You must agree to MLH data sharing");
  if (!codeOfConduct) errors.push("You must agree to the code of conduct");
  return errors;
}

async function uploadResumeIfAny(
  // Unwraps the Promise type from createClient() to get the actual Supabase client type
  supabaseClient: Awaited<ReturnType<typeof createClient>>,
  resume: File | null,
  email: string,
): Promise<string | null> {
  if (!resume || resume.size === 0) return null;

  const resume_file_name = `${email}_${resume.name}`;
  // Try upload once, and retry a second time on failure before giving up
  let uploadError: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { error } = await supabaseClient.storage
      .from("resumes")
      .upload(resume_file_name, resume, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!error) {
      uploadError = null;
      break;
    }
    uploadError = error;
  }

  if (uploadError) return null;

  let resumeUrl: string | null = null;

  // Get the public URL of the uploaded file
  const { data: urlData } = supabaseClient.storage
    .from("resumes")
    .getPublicUrl(resume_file_name);

  resumeUrl = urlData.publicUrl;

  return resumeUrl;
}

async function saveRegistrationToDatabase(
  supabaseClient: Awaited<ReturnType<typeof createClient>>,
  data: RegistrationData,
): Promise<{ uuid: string | null; error: any }> {
  // Convert github username to full URL if provided
  const githubUrl = data.githubUsername
    ? `https://github.com/${data.githubUsername}`
    : null;

  // Generate UUID ONCE, outside the retry loop
  const uuid = randomUUID();

  const maxAttempts = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { error } = await supabaseClient.from("participants").insert({
      uuid: uuid,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phoneNumber,
      age: Number.parseInt(data.age, 10),
      gender: data.gender,
      school: data.school,
      graduation_year: Number.parseInt(data.graduationYear, 10),
      level_of_study: data.educationLevel,
      country: data.country,
      major: data.major,
      diet_restrictions: data.dietRestrictions || null,
      linkedin_url: data.linkedInURL || null,
      github_url: githubUrl,
      shirt_size: data.shirtSize,
      hackathons: data.hackathons,
      race_ethnicity: data.raceEthnicity || null,
      referral_source: data.referralSource || null,
    });

    if (!error) {
      return {
        uuid: uuid,
        error: null,
      };
    }

    lastError = error;

    // Do not retry on unique violations (e.g., duplicate email)
    if (error?.code === "23505") break;
  }

  return { uuid: null, error: lastError };
}

async function generateQRCode(uuid: string): Promise<string> {
  // Create payload with all required info
  const payload = {
    uuid,
  };

  // Generate QR code as PNG buffer
  const buffer = await QRCode.toBuffer(JSON.stringify(payload), {
    errorCorrectionLevel: "M",
    type: "png",
    margin: 3,
    width: 200,
  });

  // Convert buffer to base64 (without data URL prefix - added in response)
  return buffer.toString("base64");
}

async function updateRegistrationWithQRCodeAndResume(
  supabaseClient: Awaited<ReturnType<typeof createClient>>,
  uuid: string,
  qrCodeBase64: string,
  resumeUrl: string | null,
): Promise<string | null> {
  const { error } = await supabaseClient
    .from("participants")
    .update({
      qr_base64: qrCodeBase64,
      resume_url: resumeUrl,
    })
    .eq("uuid", uuid);

  if (!error) {
    return null;
  }

  return error.message;
}
