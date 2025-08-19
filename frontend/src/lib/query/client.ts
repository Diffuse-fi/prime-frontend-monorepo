import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 3,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 0,
    },
  },
});
