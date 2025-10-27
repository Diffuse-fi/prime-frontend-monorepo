"use client";

import { useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { getAvailableChainsIds } from "@/lib/chains";
import {
  useReadonlyChainActions,
  useReadonlyChainState,
} from "@/lib/chains/ReadonlyChainContext";

const SUPPORTED = new Set(getAvailableChainsIds());

function isSupported(chainId: number | undefined): boolean {
  return typeof chainId === "number" && SUPPORTED.has(chainId);
}

export function ChainSyncEffects() {
  const { isConnected } = useAccount();
  const walletChainId = useChainId();
  const { readonlyChainId } = useReadonlyChainState();
  const { setReadonlyChainId } = useReadonlyChainActions();

  useEffect(() => {
    if (!isConnected) return;

    if (!isSupported(walletChainId)) return;

    if (walletChainId === readonlyChainId) return;

    setReadonlyChainId(walletChainId);
  }, [isConnected, walletChainId, readonlyChainId, setReadonlyChainId]);

  return null;
}
