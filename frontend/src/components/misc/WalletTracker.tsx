"use client";

import { useEffect, useRef } from "react";
import { useAccount, useAccountEffect, useChainId } from "wagmi";

import { trackEvent } from "@/lib/analytics";

export function WalletTracker() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const prevChainIdRef = useRef<number | undefined>(undefined);
  const isInitialMount = useRef(true);

  useAccountEffect({
    onConnect(data) {
      trackEvent("wallet_connect", {
        chain_id: data.chainId,
      });
    },
    onDisconnect() {
      trackEvent("wallet_disconnect");
    },
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevChainIdRef.current = chainId;
      return;
    }

    if (
      isConnected &&
      chainId !== undefined &&
      prevChainIdRef.current !== undefined &&
      chainId !== prevChainIdRef.current
    ) {
      trackEvent("chain_switch", { chain_id: chainId });
    }
    prevChainIdRef.current = chainId;
  }, [chainId, isConnected]);

  return null;
}
