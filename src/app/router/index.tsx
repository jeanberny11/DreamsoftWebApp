import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { LoginPage } from '../../features/auth/components/LoginPage';
import  Register  from '../../features/auth/components/Register';

/**
 * Temporary Dashboard Page
 * Includes a logout button for testing
 */
const TempDashboardPage = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-card mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard! This is a protected route.</p>
        <p className="text-gray-500 text-sm mt-2">
          Only accessible when logged in.
        </p>
      </div>

      {/* Sample stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-card p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold">$24,500</p>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg shadow-card p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <p className="text-3xl font-bold">1,245</p>
        </div>

        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg shadow-card p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Customers</h3>
          <p className="text-3xl font-bold">892</p>
        </div>
      </div>

      {/* Logout button */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }}
          className="bg-error-500 hover:bg-error-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

/**
 * Temporary Sales Page
 */
const TempSalesPage = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-card">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Sales</h1>
      <p className="text-gray-600">Sales management page coming soon...</p>
      <p className="text-gray-500 text-sm mt-2">This is a protected route.</p>
    </div>
  </div>
);

/**
 * Temporary Inventory Page
 */
const TempInventoryPage = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-card">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Inventory</h1>
      <p className="text-gray-600">Inventory management page coming soon...</p>
      <p className="text-gray-500 text-sm mt-2">This is a protected route.</p>
    </div>
  </div>
);

/**
 * Temporary Customers Page
 */
const TempCustomersPage = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-card">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Customers</h1>
      <p className="text-gray-600">Customer management page coming soon...</p>
      <p className="text-gray-500 text-sm mt-2">This is a protected route.</p>
    </div>
  </div>
);

/**
 * Temporary Reports Page
 */
const TempReportsPage = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-card">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Reports</h1>
      <p className="text-gray-600">Reports and analytics page coming soon...</p>
      <p className="text-gray-500 text-sm mt-2">This is a protected route.</p>
    </div>
  </div>
);

/**
 * 404 Not Found Page
 */
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-4">Page not found</p>
      <a
        href="/"
        className="text-primary-500 hover:text-primary-600 font-medium underline"
      >
        Go back home
      </a>
    </div>
  </div>
);

// ========================================
// ROUTER CONFIGURATION
// ========================================

/**
 * Router Configuration
 *
 * Route structure:
 * - / → Redirects to /dashboard
 * - /login → Public route (login page)
 * - /dashboard, /sales, /inventory, /customers, /reports → Protected routes
 * - * → 404 Not Found
 */
export const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // Public routes (only accessible when NOT logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
      path: '/register',      // ← ADD THIS
      element: <Register />,  // ← ADD THIS
    },
    ],
  },

  // Protected routes (only accessible when logged in)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <TempDashboardPage />,
      },
      {
        path: '/sales',
        element: <TempSalesPage />,
      },
      {
        path: '/inventory',
        element: <TempInventoryPage />,
      },
      {
        path: '/customers',
        element: <TempCustomersPage />,
      },
      {
        path: '/reports',
        element: <TempReportsPage />,
      },
    ],
  },

  // 404 Not Found (catch-all)
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
