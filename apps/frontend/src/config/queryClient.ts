import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configuration for TanStack Query v5
 *
 * Defaults provide:
 * - Stale time: 5 minutes (data marked for refetch after 5min)
 * - Cache time (gcTime): 10 minutes (data kept in memory after query becomes inactive)
 * - Retry logic with exponential backoff for transient failures
 * - Standard callbacks for mutation lifecycle
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (validation errors)
        if (
          error instanceof Error &&
          "status" in error &&
          typeof (error as { status?: unknown }).status === "number"
        ) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry transient errors up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s → 2s → 4s
        return Math.min(1000 * 2 ** attemptIndex, 10000);
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        if (
          error instanceof Error &&
          "status" in error &&
          typeof (error as { status?: unknown }).status === "number"
        ) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});
