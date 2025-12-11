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
    loggerQry.error("Query error", { error, key: key(query.queryKey) });
  },
  onSettled: (_data, error, query) => {
    loggerQry.debug("onSettled", {
      error: !!error,
      key: key(query.queryKey),
      state: query.state,
    });
  },
  onSuccess: (_data, query) => {
    loggerQry.debug("Query success", {
      queryKey: key(query.queryKey),
      state: query.state,
    });
  },
});

export const mutationCacheWithLogger = new MutationCache({
  onError: (error, variables, context, mutation) => {
    loggerMut.error("onError", {
      context,
      error,
      mutationKey: key(mutation.options.mutationKey),
      variables,
    });
  },
  onMutate: (variables, mutation) => {
    loggerMut.debug("onMutate", {
      mutationKey: key(mutation.options.mutationKey),
      state: mutation.state,
      variables,
    });
  },
  onSettled: (_data, error, variables, _context, mutation) => {
    loggerMut.debug("onSettled", {
      error: !!error,
      mutationKey: key(mutation.options.mutationKey),
      variables,
    });
  },
  onSuccess: (data, variables, _context, mutation) => {
    loggerMut.info("onSuccess", {
      hasData: data != undefined,
      mutationKey: key(mutation.options.mutationKey),
      variables,
    });
  },
});
