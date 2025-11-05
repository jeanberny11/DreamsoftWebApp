/**
 * Authentication Service
 *
 * Location: src/features/auth/services/auth.service.ts
 *
 * Handles all authentication-related API calls to the backend.
 * Uses the centralized API client for HTTP requests.
 *
 * SECURITY:
 * - Access tokens stored in memory only (cleared on page refresh)
 * - Refresh tokens stored as HttpOnly cookies by backend
 * - No sensitive tokens in localStorage
 */

import apiClient, {
  ErrorResponseSchema,
} from "../../../data/remote/api/client";
import type {
  LoginRequest,
  LoginResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthOperationResponse
} from "../types/auth.types";
import { tokenManager } from "../utils/tokenManager";

// ========================================
// API ENDPOINTS
// You can change these to match your backend
// ========================================

const AUTH_ENDPOINTS = {
  LOGIN: "/dreamsoftapi/Login/Login",
  REGISTER: "/auth/register",
  LOGOUT: "/dreamsoftapi/Login/Logout",
  FORGOT_PASSWORD: "/dreamsoftapi/Login/ForgotPassword",
  RESET_PASSWORD: "/dreamsoftapi/Login/ResetPassword",
  REFRESH_TOKEN: "/dreamsoftapi/Login/RefreshToken",
};

// ========================================
// AUTHENTICATION SERVICE
// ========================================

export const authService = {
  /**
   * Login user with email and password
   *
   * @param credentials - Email, password, and rememberMe flag
   * @returns Promise with accessToken and user data
   *
   * SECURITY:
   * - Access token stored in MEMORY only (via tokenManager)
   * - Refresh token sent as HttpOnly cookie by backend
   * - User data stored in localStorage (non-sensitive)
   *
   * @example
   * const response = await authService.login({
   *   email: 'user@example.com',
   *   password: 'password123',
   *   rememberMe: true
   * });
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      // Store access token in MEMORY only (not localStorage)
      if (response.data.accessToken) {
        tokenManager.setAccessToken(response.data.accessToken);
      }

      // Store user data in localStorage (non-sensitive data)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Handle Remember Me functionality
      if (credentials.rememberMe) {
        // Save email and username for next login (non-sensitive data)
        const savedCredentials = {
          email: credentials.email,
          userName: credentials.userName,
        };
        localStorage.setItem("savedCredentials", JSON.stringify(savedCredentials));
        localStorage.setItem("rememberMe", "true");
      } else {
        // Clear saved credentials if user unchecked remember me
        localStorage.removeItem("savedCredentials");
        localStorage.removeItem("rememberMe");
      }

      return response.data;
    } catch (error: any) {
      if (ErrorResponseSchema.safeParse(error).success) {
        const parsedError = ErrorResponseSchema.parse(error);
        throw new Error(`Error Type: ${parsedError.ErrorType} \n
            Error Code: ${parsedError.ErrorCode} \n
            Message: ${parsedError.ErrorMessage}`);
      } else {
        throw error;
      }
    }
  },

  /**
   * Logout current user
   *
   * SECURITY:
   * - Clears access token from memory
   * - Backend clears HttpOnly refresh token cookie
   * - Clears user data from localStorage
   *
   * @example
   * await authService.logout();
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint to clear HttpOnly cookie
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);

      // Clear access token from memory
      tokenManager.clearAccessToken();

      // Clear user data from localStorage
      localStorage.removeItem("user");

      // Note: We don't clear "rememberMe" and "savedCredentials" here
      // so the user's credentials remain saved for next login if they checked "Remember Me"

      console.log("✅ User logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Still clear data even if API call fails
      tokenManager.clearAccessToken();
      localStorage.removeItem("user");
    }
  },

  /**
   * Refresh authentication token
   *
   * SECURITY:
   * - Uses HttpOnly refresh token cookie (sent automatically)
   * - Stores new access token in memory only
   * - If refresh fails, user is logged out
   *
   * @returns Promise with new access token
   *
   * @example
   * const newToken = await authService.refreshToken();
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.REFRESH_TOKEN
      );

      // Store new access token in memory only
      if (response.data.accessToken) {
        tokenManager.setAccessToken(response.data.accessToken);
        return response.data.accessToken;
      }

      throw new Error("No access token received from refresh");
    } catch (error: any) {
      console.error("Refresh token error:", error);
      // If refresh fails, logout user
      this.logout();
      throw new Error("Session expired. Please login again.");
    }
  },

  /**
   * Check if user is authenticated
   *
   * SECURITY:
   * - Checks for access token in memory (not localStorage)
   *
   * @returns boolean
   *
   * @example
   * if (authService.isAuthenticated()) {
   *   // User is logged in
   * }
   */
  isAuthenticated(): boolean {
    return tokenManager.hasAccessToken();
  },

  /**
   * Get stored user from localStorage
   *
   * @returns User object or null
   *
   * @example
   * const user = authService.getStoredUser();
   */
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  },

  /**
   * Get access token from memory
   *
   * SECURITY:
   * - Retrieves token from memory (not localStorage)
   *
   * @returns Access token string or null
   */
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  /**
   * Request password reset link
   *
   * Sends a password reset email to the user if the email exists.
   * Always returns success to prevent email enumeration attacks.
   *
   * SECURITY:
   * - Returns success even if email doesn't exist (prevents email enumeration)
   * - Backend handles rate limiting (max 3 requests per hour)
   * - Reset token expires in 15 minutes
   *
   * @param request - Email address to send reset link to
   * @returns Promise with success status and message
   *
   * @example
   * const response = await authService.forgotPassword({
   *   email: 'user@example.com'
   * });
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<AuthOperationResponse> {
    try {
      const response = await apiClient.post<AuthOperationResponse>(
        AUTH_ENDPOINTS.FORGOT_PASSWORD,
        request
      );

      return response.data;
    } catch (error: any) {
      // Handle backend errors
      if (ErrorResponseSchema.safeParse(error).success) {
        const parsedError = ErrorResponseSchema.parse(error);
        throw new Error(parsedError.ErrorMessage || 'Failed to send reset link');
      }

      // Generic error
      throw new Error('Failed to send password reset link. Please try again.');
    }
  },

  /**
   * Reset password with token
   *
   * Validates the reset token and updates the user's password.
   *
   * SECURITY:
   * - Token must be valid and not expired (15 min)
   * - Token can only be used once
   * - Password must meet strength requirements (validated by backend)
   *
   * @param request - Reset token and new password
   * @returns Promise with success status and message
   *
   * @example
   * const response = await authService.resetPassword({
   *   token: 'abc123...',
   *   newPassword: 'NewSecure123!',
   *   confirmPassword: 'NewSecure123!'
   * });
   */
  async resetPassword(request: ResetPasswordRequest): Promise<AuthOperationResponse> {
    try {
      const response = await apiClient.post<AuthOperationResponse>(
        AUTH_ENDPOINTS.RESET_PASSWORD,
        request
      );

      return response.data;
    } catch (error: any) {
      // Handle backend errors
      if (ErrorResponseSchema.safeParse(error).success) {
        const parsedError = ErrorResponseSchema.parse(error);
        throw new Error(parsedError.ErrorMessage || 'Failed to reset password');
      }

      // Generic error
      throw new Error('Failed to reset password. Please try again.');
    }
  },
};

export default authService;
