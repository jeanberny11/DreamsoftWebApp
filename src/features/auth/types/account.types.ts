// Account Types matching C# backend models

export interface Gender {
  genderId: number;
  name: string;
}

export interface IdType {
  idTypeId: number;
  name: string;
}

export interface Country {
  countryId: number;
  name: string;
}

export interface Province {
  provinceId: number;
  name: string;
}

export interface Municipality {
  municipalityId: number;
  name: string;
}

// Account Creation Model matching C# AccountCreate
export interface AccountCreate {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  country: Country;
  province: Province;
  municipality: Municipality;
  dob: string; // ISO date string
  gender: Gender;
  idNumber: string;
  idType: IdType;
  username: string;
  password: string;
  emailVerified: boolean;
}

// Email Verification Types
export interface SendVerificationCodeRequest {
  email: string;
}

export interface SendVerificationCodeResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

export interface VerifyEmailCodeResponse {
  success: boolean;
  verified: boolean;
  message: string;
}