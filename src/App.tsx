/**
 * Main Application Component
 *
 * This is the root component of our DreamSoft Sales & Inventory Management App.
 * It wires together:
 * - QueryProvider (React Query for server state)
 * - RouterProvider (React Router for navigation)
 * - Theme initialization (from Zustand UI store)
 */

import './index.css';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './data/remote/providers/QueryProvider';
import { router } from './app/router';
import { initializeTheme } from './data/local/stores/ui.store';
import { useEffect } from 'react';

function App() {
  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
