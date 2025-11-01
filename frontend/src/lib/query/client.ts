import { QueryClient } from "@tanstack/react-query";
import { defaultRetry } from "./defaults";
import { mutationCacheWithLogger, queryCacheWithLogger } from "./logging";

export const queryClient = new QueryClient({
  queryCache: queryCacheWithLogger,
  mutationCache: mutationCacheWithLogger,
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: defaultRetry,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10_000),
    },
    mutations: {
      retry: 0,
    },
  },
});
