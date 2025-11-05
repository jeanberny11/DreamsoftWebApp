/**
 * Authentication Store (Zustand)
 *
 * Location: src/features/auth/stores/auth.store.ts
 *
 * Global state management for authentication.
 * Provides user data, auth status, and auth actions throughout the app.
 *
 * SECURITY:
 * - Access tokens stored in memory only (via tokenManager)
 * - Refresh tokens stored as HttpOnly cookies by backend
 * - Only user data (non-sensitive) stored in localStorage
 * - Token removed from store (handled by tokenManager)
 */

import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type {
  User,
  LoginRequest,
} from '../types/auth.types';
import { isPublicRoute } from '../../../app/router/routes.constants';

// ========================================
// AUTH STORE STATE INTERFACE
// ========================================

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// ========================================
// CREATE AUTH STORE
// ========================================

export const useAuthStore = create<AuthStore>((set) => ({
  // ========================================
  // INITIAL STATE
  // ========================================
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // ========================================
  // ACTIONS
  // ========================================

  /**
   * Login user
   *
   * SECURITY:
   * - Access token stored in memory (not in this store)
   * - User data stored in localStorage (non-sensitive)
   *
   * @param credentials - Email and password
   *
   * @example
   * const { login } = useAuthStore();
   * await login({ email: 'user@example.com', password: 'pass123' });
   */
  login: async (credentials: LoginRequest) => {
    try {
      set({ isLoading: true, error: null });

      // Call auth service (which handles token storage in memory)
      const response = await authService.login(credentials);

      // Update store state (no token here - it's in memory)
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('✅ User logged in successfully');
    } catch (error: any) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.errorMessage,
      });
      throw error; // Re-throw so component can handle it
    }
  },

  /**
   * Logout user
   *
   * SECURITY:
   * - Clears access token from memory
   * - Clears user data from localStorage
   * - Backend clears HttpOnly refresh token cookie
   *
   * @example
   * const { logout } = useAuthStore();
   * logout();
   */
  logout: () => {
    // Call auth service to clear memory token and localStorage
    authService.logout();

    // Clear store state
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    console.log('✅ User logged out');
  },

  /**
   * Initialize auth state on app load
   *
   * SECURITY:
   * - Attempts to refresh access token using HttpOnly refresh token cookie
   * - If successful, restores user session
   * - If failed, user must login again
   * - Skips auth check for public routes (login, register, reset password, etc.)
   *
   * @example
   * useEffect(() => {
   *   initializeAuth();
   * }, []);
   */
  initializeAuth: async () => {
    try {
      // Check if current path is a public route
      const currentPath = window.location.pathname;

      // Skip auth initialization for public routes
      if (isPublicRoute(currentPath)) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        console.log('ℹ️ Public route detected - skipping auth initialization');
        return;
      }

      set({ isLoading: true });

      // Try to refresh access token using HttpOnly cookie
      // This will restore the session if refresh token is valid
      const newAccessToken = await authService.refreshToken();

      // If refresh successful, get user data from localStorage
      const user = authService.getStoredUser();

      if (newAccessToken && user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        console.log('✅ Auth session restored via refresh token');
      } else {
        throw new Error('No user data found');
      }
    } catch (error) {
      // No valid session - user needs to login
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log('ℹ️ No valid session found - please login');
    }
  },

  /**
   * Clear error state
   * 
   * @example
   * const { clearError } = useAuthStore();
   * clearError();
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Set loading state
   * 
   * @param loading - Loading boolean
   * 
   * @example
   * setLoading(true);
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

// ========================================
// SELECTOR HOOKS (Optional - for better performance)
// ========================================

/**
 * Get only user data (optimized)
 */
export const useUser = () => useAuthStore((state) => state.user);

/**
 * Get only auth status (optimized)
 */
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

/**
 * Get only loading state (optimized)
 */
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

/**
 * Get only error state (optimized)
 */
export const useAuthError = () => useAuthStore((state) => state.error);

/**
 * Get only auth actions (optimized)
 */
export const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    clearError: state.clearError,
  }));

export default useAuthStore;