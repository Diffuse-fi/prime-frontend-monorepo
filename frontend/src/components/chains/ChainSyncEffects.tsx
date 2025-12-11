"use client";

import { useEffect } from "react";
import { useAccount, useChainId } from "wagmi";

import { getAvailableChainsIds } from "@/lib/chains";
import {
  useReadonlyChainActions,
  useReadonlyChainState,
} from "@/lib/chains/ReadonlyChainContext";
import { chainLogger } from "@/lib/core/utils/loggers";
import { installWagmiWatchers } from "@/lib/wagmi/logging";

const SUPPORTED = new Set(getAvailableChainsIds());

export function ChainSyncEffects() {
  const { isConnected } = useAccount();
  const walletChainId = useChainId();
  const { readonlyChainId } = useReadonlyChainState();
  const { setReadonlyChainId } = useReadonlyChainActions();

  useEffect(() => {
    const uninstall = installWagmiWatchers();
    return () => {
      uninstall();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    if (!isSupported(walletChainId)) return;

    if (walletChainId === readonlyChainId) return;

    setReadonlyChainId(walletChainId);
  }, [isConnected, walletChainId, readonlyChainId, setReadonlyChainId]);

  useEffect(() => {
    chainLogger.info("chain id changed", {
      readonlyChainId,
    });
  }, [readonlyChainId]);

  return null;
}

function isSupported(chainId: number | undefined): boolean {
  return typeof chainId === "number" && SUPPORTED.has(chainId);
}
