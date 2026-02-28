"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";

import {
  useReadonlyChainActions,
  useReadonlyChainState,
} from "@/lib/chains/ReadonlyChainContext";
import { useQueryWriter } from "@/lib/misc/useQueryWriter";

import { useChainQuerySync } from "./useChainQuerySync";

export function ChainQuerySyncEffects() {
  const { queryObj, setQuery } = useQueryWriter();
  const { readonlyChainId } = useReadonlyChainState();
  const { setReadonlyChainId } = useReadonlyChainActions();
  const { isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  useChainQuerySync({
    isConnected,
    queryObj,
    readonlyChainId,
    setQuery,
    setReadonlyChainId,
    switchChainAsync,
    walletChainId,
  });

  return null;
}
