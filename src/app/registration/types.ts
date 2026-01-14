export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  country: string;
  educationLevel: string;
  major: string;
  age: string;
  gender: string;
  phoneNumber: string;
  shirtSize: string;
  hackathons: string;
  graduationYear: string;
  githubUsername?: string;
  linkedInURL?: string;
  dietRestrictions?: string;
  raceEthnicity: string[];
  referralSource: string[];
}

export interface RegistrationResponse {
  message: string | string[];
  data?: {
    email: string;
  };
}
