import { MutationCache, QueryCache } from "@tanstack/react-query";
import { loggerMut, loggerQry } from "../core/utils/loggers";

const key = (qk: unknown) => {
  try {
    return JSON.stringify(qk);
  } catch {
    return String(qk);
  }
};

export const queryCacheWithLogger = new QueryCache({
  onError: (error, query) => {
    loggerQry.error("Query error", { key: key(query.queryKey), error });
  },
  onSuccess: (_data, query) => {
    loggerQry.debug("Query success", {
      queryKey: key(query.queryKey),
      state: query.state,
    });
  },
  onSettled: (_data, error, query) => {
    loggerQry.debug("onSettled", {
      key: key(query.queryKey),
      error: !!error,
      state: query.state,
    });
  },
});

export const mutationCacheWithLogger = new MutationCache({
  onMutate: (variables, mutation) => {
    loggerMut.debug("onMutate", {
      mutationKey: key(mutation.options.mutationKey),
      variables,
      state: mutation.state,
    });
  },
  onError: (error, variables, context, mutation) => {
    loggerMut.error("onError", {
      mutationKey: key(mutation.options.mutationKey),
      variables,
      error,
      context,
    });
  },
  onSuccess: (data, variables, _context, mutation) => {
    loggerMut.info("onSuccess", {
      mutationKey: key(mutation.options.mutationKey),
      variables,
      hasData: data != null,
    });
  },
  onSettled: (_data, error, variables, _context, mutation) => {
    loggerMut.debug("onSettled", {
      mutationKey: key(mutation.options.mutationKey),
      variables,
      error: !!error,
    });
  },
});
