"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import { getChainById } from "@/lib/chains";
import {
  formatChainQueryValue,
  getChainQueryValue,
  parseChainQueryValue,
} from "@/lib/chains/query";
import {
  useReadonlyChainActions,
  useReadonlyChainState,
} from "@/lib/chains/ReadonlyChainContext";
import { chainLogger } from "@/lib/core/utils/loggers";
import { useQueryWriter } from "@/lib/misc/useQueryWriter";
import { toast } from "@/lib/toast";

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
  const pendingQueryValueRef = useRef<string | undefined>(undefined);
  const hasPendingRef = useRef(false);

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
        try {
          const switchedChain = await switchChainAsync({
            chainId: targetChainId,
          });
          if (switchedChain.id !== targetChainId) {
            updateQuery(currentWalletChainId ?? currentReadonlyChainId);
            return;
          }
          setReadonlyChainId(targetChainId);
        } catch (error) {
          chainLogger.warn("chain switch failed", {
            error,
            requestedChainId: targetChainId,
          });
          const targetChain = getChainById(targetChainId);
          const targetLabel = targetChain?.name ?? `chain ${targetChainId}`;
          toast(`Failed to switch to ${targetLabel}. Check your wallet.`);
          updateQuery(currentWalletChainId ?? currentReadonlyChainId);
        }
      };

      void switchChain();
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
      updateQuery();
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

  return null;
}
