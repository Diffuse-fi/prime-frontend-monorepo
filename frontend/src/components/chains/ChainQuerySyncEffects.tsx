"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import {
  formatChainQueryValue,
  getChainQueryValue,
  parseChainQueryValue,
} from "@/lib/chains/query";
import {
  useReadonlyChainActions,
  useReadonlyChainState,
} from "@/lib/chains/ReadonlyChainContext";
import { useQueryWriter } from "@/lib/misc/useQueryWriter";

const QUERY_OPTIONS = { replace: true };

export function ChainQuerySyncEffects() {
  const { queryObj, setQuery } = useQueryWriter();
  const chainQueryValue = useMemo(
    () => getChainQueryValue(queryObj.chain),
    [queryObj.chain]
  );
  const desiredChainId = useMemo(
    () => parseChainQueryValue(queryObj.chain),
    [queryObj.chain]
  );
  const { readonlyChainId } = useReadonlyChainState();
  const { setReadonlyChainId } = useReadonlyChainActions();
  const { isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const lastQueryValueRef = useRef<string | undefined>(undefined);
  const pendingQueryValueRef = useRef<null | string | undefined>(null);
  const walletChainIdRef = useRef(walletChainId);
  useEffect(() => {
    walletChainIdRef.current = walletChainId;
  }, [walletChainId]);

  const updateQuery = useCallback(
    (chainId?: number) => {
      const nextValue =
        chainId === undefined ? undefined : formatChainQueryValue(chainId);
      if (nextValue === chainQueryValue) return;
      pendingQueryValueRef.current = nextValue;
      setQuery({ chain: nextValue }, QUERY_OPTIONS);
    },
    [chainQueryValue, setQuery]
  );

  const queryValueChanged = chainQueryValue !== lastQueryValueRef.current;
  const isPendingChange =
    pendingQueryValueRef.current !== null &&
    chainQueryValue === pendingQueryValueRef.current;
  const isExternalQueryChange = queryValueChanged && !isPendingChange;

  const applyRequestedChain = useCallback(
    (targetChainId: number) => {
      if (!isConnected) {
        setReadonlyChainId(targetChainId);
        return;
      }

      if (walletChainId === targetChainId) {
        setReadonlyChainId(targetChainId);
        return;
      }

      if (!switchChainAsync) {
        updateQuery(walletChainIdRef.current ?? readonlyChainId);
        return;
      }

      void (async () => {
        try {
          await switchChainAsync({ chainId: targetChainId });
          if (walletChainIdRef.current !== targetChainId) {
            updateQuery(walletChainIdRef.current ?? readonlyChainId);
          }
        } catch {
          updateQuery(walletChainIdRef.current ?? readonlyChainId);
        }
      })();
    },
    [
      isConnected,
      readonlyChainId,
      setReadonlyChainId,
      switchChainAsync,
      updateQuery,
      walletChainId,
    ]
  );

  useEffect(() => {
    if (isPendingChange) {
      pendingQueryValueRef.current = null;
    }
    lastQueryValueRef.current = chainQueryValue;
  }, [chainQueryValue, isPendingChange]);

  useEffect(() => {
    if (chainQueryValue !== undefined && desiredChainId == null) {
      updateQuery();
      return;
    }

    if (
      isExternalQueryChange &&
      chainQueryValue !== undefined &&
      desiredChainId != null &&
      desiredChainId !== readonlyChainId
    ) {
      applyRequestedChain(desiredChainId);
      return;
    }

    const expectedValue = formatChainQueryValue(readonlyChainId);
    if (chainQueryValue !== expectedValue) {
      updateQuery(readonlyChainId);
    }
  }, [
    chainQueryValue,
    desiredChainId,
    isExternalQueryChange,
    readonlyChainId,
    applyRequestedChain,
    updateQuery,
  ]);

  return null;
}
