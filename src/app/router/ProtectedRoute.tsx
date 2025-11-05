import { useIsAuthenticated } from "../../features/auth/stores/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routes.constants";

export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // User is NOT authenticated, redirect to login
    console.log("🔒 Not authenticated, redirecting to login...");
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
}

export default ProtectedRoute;
