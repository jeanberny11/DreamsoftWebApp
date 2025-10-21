/**
 * PublicRoute Component
 *
 * Wraps routes that are only accessible when NOT logged in (login, register).
 * If user is already logged in, redirects to dashboard.
 *
 * Usage:
 * <Route element={<PublicRoute />}>
 *   <Route path="/login" element={<LoginPage />} />
 * </Route>
 */

import { Navigate, Outlet } from 'react-router-dom';

/**
 * Check if user is authenticated
 */
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * PublicRoute Component
 */
export function PublicRoute() {
  // Check if user is already authenticated
  if (isAuthenticated()) {
    // User is logged in, redirect to dashboard
    console.log('✅ Already authenticated, redirecting to dashboard...');
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated, render the child routes (login, register)
  return <Outlet />;
}

export default PublicRoute;
