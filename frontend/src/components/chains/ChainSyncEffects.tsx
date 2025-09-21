"use client";

import { useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import {
  useReadonlyChainState,
  useReadonlyChainActions,
} from "@/lib/chains/useReadonlyChain";
import { getAvailableChainsIds } from "@/lib/chains";

const SUPPORTED = new Set(getAvailableChainsIds());

export function ChainSyncEffects() {
  const { isConnected } = useAccount();
  const walletChainId = useChainId();
  const { readonlyChainId, followWallet } = useReadonlyChainState();
  const { setReadonlyChainId } = useReadonlyChainActions();

  useEffect(() => {
    if (!isConnected || !followWallet) return;

    if (typeof walletChainId !== "number" || !SUPPORTED.has(walletChainId)) return;

    if (walletChainId === readonlyChainId) return;

    setReadonlyChainId(walletChainId);
  }, [isConnected, followWallet, walletChainId, readonlyChainId, setReadonlyChainId]);

  return null;
}
