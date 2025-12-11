import { QueryClient } from "@tanstack/react-query";

import { defaultRetry } from "./defaults";
import { mutationCacheWithLogger, queryCacheWithLogger } from "./logging";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 0,
    },
    queries: {
      gcTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: defaultRetry,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10_000),
      staleTime: 1000 * 60,
    },
  },
  mutationCache: mutationCacheWithLogger,
  queryCache: queryCacheWithLogger,
});
