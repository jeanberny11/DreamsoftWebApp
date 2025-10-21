/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * If user is not logged in, redirects to login page.
 *
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 */

import { Navigate, Outlet } from 'react-router-dom';

/**
 * Check if user is authenticated
 *
 * Currently checks for token in localStorage.
 * Later, this will be replaced with a proper auth store.
 */
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token; // !! converts to boolean (null/undefined = false, string = true)
};

/**
 * ProtectedRoute Component
 */
export function ProtectedRoute() {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // User is NOT authenticated, redirect to login
    console.log('🔒 Not authenticated, redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
}

export default ProtectedRoute;
