/**
 * API Client
 *
 * Centralized Axios instance for all API calls.
 * This client automatically:
 * - Adds authentication tokens to requests
 * - Handles common errors globally
 * - Configures base URL and timeout from environment variables
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ========================================
// SECTION 1: Configuration from .env
// ========================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '15000', 10);

// ========================================
// SECTION 2: Create Axios Instance
// ========================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// SECTION 3: Request Interceptor
// Runs BEFORE every request is sent
// ========================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');

    // If token exists, add it to Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request in development mode (helps with debugging)
    if (import.meta.env.VITE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request errors (errors before request is even sent)
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ========================================
// SECTION 4: Response Interceptor
// Runs AFTER every response is received
// ========================================

apiClient.interceptors.response.use(
  // Success handler - runs when status is 2xx
  (response) => {
    // Log the response in development mode
    if (import.meta.env.VITE_ENV === 'development') {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }

    return response;
  },

  // Error handler - runs when status is NOT 2xx
  (error: AxiosError) => {
    // Get error details
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || error.message;

    // Log error in development
    if (import.meta.env.VITE_ENV === 'development') {
      console.error('❌ API Error:', {
        status,
        message,
        url: error.config?.url,
      });
    }

    // Handle specific error codes
    switch (status) {
      case 401:
        // Unauthorized - Token expired or invalid
        console.error('🔒 Unauthorized: Please login again');

        // Clear auth data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Redirect to login page (only if not already there)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        break;

      case 403:
        // Forbidden - User doesn't have permission
        console.error('🚫 Forbidden: You don\'t have permission to access this resource');
        break;

      case 404:
        // Not Found
        console.error('🔍 Not Found: The requested resource was not found');
        break;

      case 422:
        // Validation Error
        console.error('⚠️ Validation Error:', message);
        break;

      case 500:
        // Server Error
        console.error('💥 Server Error: Something went wrong on the server');
        break;

      case 503:
        // Service Unavailable
        console.error('⏸️ Service Unavailable: The server is temporarily unavailable');
        break;

      default:
        // Other errors
        console.error(`⚠️ Error ${status}:`, message);
    }

    return Promise.reject(error);
  }
);

// ========================================
// SECTION 5: Export
// ========================================

/**
 * Export the configured API client
 *
 * Usage in your services:
 *
 * import apiClient from '@/app/api/client';
 *
 * // GET request
 * const response = await apiClient.get('/sales');
 *
 * // POST request
 * const response = await apiClient.post('/sales', { name: 'New Sale' });
 *
 * // PUT request
 * const response = await apiClient.put('/sales/1', { name: 'Updated Sale' });
 *
 * // DELETE request
 * const response = await apiClient.delete('/sales/1');
 */
export default apiClient;

/**
 * Helper function to get current API base URL
 */
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};
