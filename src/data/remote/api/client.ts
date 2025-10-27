import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { z } from "zod";
import { tokenManager } from "../../../features/auth/utils/tokenManager";
import type { LoginResponse } from "../../../features/auth/types/auth.types";

export const ErrorResponseSchema = z.object({
  StatusCode: z.number(),
  ErrorCode: z.string(),
  ErrorType: z.string(),
  ErrorMessage: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ========================================
// SECTION 1: Configuration from .env
// ========================================

const API_BASE_URL = "http://localhost:5279";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "15000", 10);

// ========================================
// SECTION 2: Create Axios Instance
// ========================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// ========================================
// SECTION 3: Request Interceptor
// Runs BEFORE every request is sent
// ========================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from memory (NOT localStorage)
    const token = tokenManager.getAccessToken();

    // If token exists, add it to Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request in development mode (helps with debugging)
    if (import.meta.env.VITE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request errors (errors before request is even sent)
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ========================================
// SECTION 4: Token Refresh Logic
// ========================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ========================================
// SECTION 5: Response Interceptor
// Runs AFTER every response is received
// ========================================

apiClient.interceptors.response.use(
  // Success handler - runs when status is 2xx
  (response) => {
    // Log the response in development mode
    if (import.meta.env.VITE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }

    return response;
  },

  // Error handler - runs when status is NOT 2xx
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const errorResponse: ErrorResponse =
      error.response &&
      error.response.data &&
      ErrorResponseSchema.safeParse(error.response.data).success
        ? ErrorResponseSchema.parse(error.response.data)
        : {
            StatusCode: error.response?.status || 500,
            ErrorCode: error.response?.status.toString() || "UNKNOWN_ERROR",
            ErrorType: "UNKNOWN_ERROR",
            ErrorMessage:
              (error.response?.data as any)?.message || error.message,
          };

    // Log error in development
    if (import.meta.env.VITE_ENV === "development") {
      console.error("❌ API Error:", {
        errorResponse,
        url: error.config?.url,
      });
    }

    // Handle 401 Unauthorized with token refresh
    if (errorResponse.StatusCode === 401 && !originalRequest._retry) {
      // Don't retry if it's the refresh token endpoint itself
      if (originalRequest.url?.includes("/RefreshToken")) {
        // Refresh token failed - clear everything and redirect to login
        console.error("🔒 Refresh token expired - Please login again");
        tokenManager.clearAccessToken();
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(errorResponse);
      }

      // Don't retry if it's the login endpoint itself (wrong credentials)
      if (originalRequest.url?.includes("/Login/Login")) {
        // Login failed - just reject with the error (invalid credentials)
        console.error("🔒 Login failed - Invalid credentials");
        return Promise.reject(errorResponse);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark as retrying and start refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await apiClient.post<LoginResponse>(
          "/dreamsoftapi/Login/RefreshToken"
        );

        const newAccessToken = response.data.accessToken;

        // Store new token in memory
        tokenManager.setAccessToken(newAccessToken);

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear everything and redirect to login
        processQueue(refreshError, null);
        tokenManager.clearAccessToken();
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error codes
    switch (errorResponse.StatusCode) {
      case 403:
        // Forbidden - User doesn't have permission
        console.error(
          "🚫 Forbidden: You don't have permission to access this resource"
        );
        break;

      case 404:
        // Not Found
        console.error("🔍 Not Found: The requested resource was not found");
        break;

      case 422:
        // Validation Error
        console.error("⚠️ Validation Error:", errorResponse.ErrorMessage);
        break;

      case 500:
        // Server Error
        console.error("💥 Server Error: Something went wrong on the server");
        break;

      case 503:
        // Service Unavailable
        console.error(
          "⏸️ Service Unavailable: The server is temporarily unavailable"
        );
        break;

      default:
        // Other errors
        console.error(
          `⚠️ Error ${errorResponse.StatusCode}:`,
          errorResponse.ErrorMessage
        );
    }

    return Promise.reject(errorResponse);
  }
);

export default apiClient;

/**
 * Helper function to get current API base URL
 */
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};
