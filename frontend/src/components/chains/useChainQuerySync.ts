"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { getChainById } from "@/lib/chains";
import {
  formatChainQueryValue,
  getChainQueryValue,
  parseChainQueryValue,
} from "@/lib/chains/query";
import { chainLogger } from "@/lib/core/utils/loggers";
import { toast } from "@/lib/toast";

const QUERY_OPTIONS = { replace: true };

export type ChainQuerySyncParams = {
  isConnected: boolean;
  queryObj: { chain?: unknown };
  readonlyChainId: number;
  setQuery: (next: Record<string, unknown>, opts?: { replace?: boolean }) => void;
  setReadonlyChainId: (id: number) => void;
  switchChainAsync?: (args: { chainId: number }) => Promise<{ id: number }>;
  walletChainId?: number;
};

export function useChainQuerySync({
  isConnected,
  queryObj,
  readonlyChainId,
  setQuery,
  setReadonlyChainId,
  switchChainAsync,
  walletChainId,
}: ChainQuerySyncParams) {
  const chainQueryValue = useMemo(
    () => getChainQueryValue(queryObj.chain),
    [queryObj.chain]
  );
  const desiredChainId = useMemo(
    () => parseChainQueryValue(queryObj.chain),
    [queryObj.chain]
  );

  const lastQueryValueRef = useRef<string | undefined>(undefined);
  const pendingQueryValueRef = useRef<string | undefined>(undefined);
  const hasPendingRef = useRef(false);
  // Avoid re-adding a default chain immediately after stripping an invalid query.
  const suppressAutoAddRef = useRef(false);

  const updateQuery = useCallback(
    (chainId?: number) => {
      const nextValue =
        chainId === undefined ? undefined : formatChainQueryValue(chainId);
      if (nextValue === chainQueryValue) return;
      pendingQueryValueRef.current = nextValue;
      hasPendingRef.current = true;
      setQuery({ chain: nextValue }, QUERY_OPTIONS);
    },
    [chainQueryValue, setQuery]
  );

  const queryValueChanged = chainQueryValue !== lastQueryValueRef.current;
  const isPendingChange =
    hasPendingRef.current && chainQueryValue === pendingQueryValueRef.current;
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
        updateQuery(walletChainId ?? readonlyChainId);
        return;
      }

      const currentWalletChainId = walletChainId;
      const currentReadonlyChainId = readonlyChainId;

      const switchChain = async () => {
        const switchedChain = await switchChainAsync({
          chainId: targetChainId,
        });
        if (switchedChain.id !== targetChainId) {
          updateQuery(currentWalletChainId ?? currentReadonlyChainId);
          return;
        }
        setReadonlyChainId(targetChainId);
      };

      switchChain().catch(error => {
        chainLogger.warn("chain switch failed", {
          error,
          requestedChainId: targetChainId,
        });
        const targetChain = getChainById(targetChainId);
        const targetLabel = targetChain?.name ?? `chain ${targetChainId}`;
        toast(`Failed to switch to ${targetLabel}. Check your wallet.`);
        updateQuery(currentWalletChainId ?? currentReadonlyChainId);
      });
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
      hasPendingRef.current = false;
      pendingQueryValueRef.current = undefined;
    }
    lastQueryValueRef.current = chainQueryValue;
  }, [chainQueryValue, isPendingChange]);

  useEffect(() => {
    if (chainQueryValue !== undefined && desiredChainId === null) {
      suppressAutoAddRef.current = true;
      updateQuery();
      return;
    }

    if (
      suppressAutoAddRef.current &&
      chainQueryValue === undefined &&
      desiredChainId === null
    ) {
      suppressAutoAddRef.current = false;
      return;
    }

    if (
      isExternalQueryChange &&
      chainQueryValue !== undefined &&
      desiredChainId !== null &&
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
}
