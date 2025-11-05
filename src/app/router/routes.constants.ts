/**
 * Route Constants
 *
 * Centralized route definitions to avoid duplication.
 * Use these constants throughout the app for route matching and navigation.
 */

// ========================================
// INDIVIDUAL ROUTE PATHS
// ========================================

export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_WITH_TOKEN: '/reset-password/:token',

  // Protected routes
  ROOT: '/',
  DASHBOARD: '/dashboard',
  SALES: '/sales',
  INVENTORY: '/inventory',
  CUSTOMERS: '/customers',
  REPORTS: '/reports',
} as const;

/**
 * Public routes that don't require authentication
 * These routes are accessible without being logged in
 */
export const PUBLIC_ROUTES = [
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

/**
 * Protected routes that require authentication
 * These routes redirect to login if user is not authenticated
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.SALES,
  ROUTES.INVENTORY,
  ROUTES.CUSTOMERS,
  ROUTES.REPORTS,
] as const;

/**
 * Check if a given path is a public route
 * @param path - The current pathname to check
 * @returns true if the path is a public route
 */
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some(route => path.startsWith(route));
};

/**
 * Check if a given path is a protected route
 * @param path - The current pathname to check
 * @returns true if the path is a protected route
 */
export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};
