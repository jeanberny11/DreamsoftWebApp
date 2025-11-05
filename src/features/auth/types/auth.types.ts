import type { Country, Gender, IdType, Municipality, Province } from "./account.types";

export interface Account {
    accountId: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    country: Country;
    province: Province;
    municipality: Municipality;
    accountType: AccountType;
    dob: string | null;
    gender: Gender;
    accountNumber: string;
    idNumber: string;
    idType: IdType;
}

export interface AccountType {
    accountTypeId: number;
    name: string;
}

export interface LoginRequest {
    email: string;
    userName: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
}

export interface Role {
    roleId: number;
    name: string;
    superUser: boolean;
    admin: boolean;
    accountId: number;
}


export interface User {
    userId: number;
    account: Account;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    role: Role;
    active: boolean;
}

// ========================================
// FORGOT PASSWORD TYPES
// ========================================

/**
 * Generic API response for authentication operations
 * Used for forgot password, reset password, and similar operations
 *
 * @property success - Whether the operation was successful
 * @property message - User-friendly message about the result
 */
export interface AuthOperationResponse {
  success: boolean;
  message: string;
}

/**
 * Request to initiate password reset process
 *
 * @property email - User's email address (account level)
 * @property userName - User's username to identify specific user in the account
 */
export interface ForgotPasswordRequest {
  email: string;
  userName: string;
}

/**
 * Request to reset password with token
 *
 * @property token - Password reset token from email link
 * @property newPassword - New password to set
 * @property confirmPassword - Confirmation of new password
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}