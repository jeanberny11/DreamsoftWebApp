/**
 * React Query Provider
 *
 * Wraps the entire application with React Query (TanStack Query).
 * React Query manages server state (data fetching, caching, synchronization).
 *
 * Benefits:
 * - Automatic caching and background updates
 * - Loading and error states handled automatically
 * - Request deduplication
 * - Optimistic updates support
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

/**
 * Configure the Query Client
 *
 * These settings apply to ALL queries in your app unless overridden.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered fresh (no refetch during this time)
      staleTime: 5 * 60 * 1000, // 5 minutes

      // How long inactive data stays in cache before being deleted
      gcTime: 10 * 60 * 1000, // 10 minutes (gcTime = garbage collection time)

      // Retry failed requests
      retry: 1, // Retry once on failure

      // Don't refetch when window regains focus
      refetchOnWindowFocus: false, // Annoying during development

      // Refetch when component mounts if data is stale
      refetchOnMount: true,

      // Refetch on network reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Don't retry mutations (POST, PUT, DELETE)
      retry: 0, // Avoid duplicate operations
    },
  },
});

/**
 * Props interface
 */
interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider Component
 *
 * Usage: Wrap your entire app with this provider
 *
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* React Query DevTools - Only visible in development */}
      {import.meta.env.VITE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

/**
 * Export the query client for advanced usage
 *
 * Example: Manually invalidate queries
 * import { queryClient } from '@/data/remote/providers/QueryProvider';
 * queryClient.invalidateQueries({ queryKey: ['sales'] });
 */
export { queryClient };

export default QueryProvider;
