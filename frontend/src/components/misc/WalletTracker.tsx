"use client";

import { useEffect, useRef } from "react";
import { useAccount, useAccountEffect, useChainId } from "wagmi";

import { trackEvent } from "@/lib/analytics";

/**
 * WalletTracker component
 * Tracks wallet connection, disconnection, and chain switching events
 */
export function WalletTracker() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const prevAddressRef = useRef<string | undefined>(undefined);
  const prevChainIdRef = useRef<number | undefined>(undefined);
  const prevConnectedRef = useRef<boolean>(false);

  // Track wallet connection and disconnection
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

  // Track chain switching
  useEffect(() => {
    if (
      isConnected &&
      chainId !== undefined &&
      prevChainIdRef.current !== undefined &&
      chainId !== prevChainIdRef.current
    ) {
      trackEvent("chain_switch", {
        chain_id: chainId,
      });
    }
    prevChainIdRef.current = chainId;
  }, [chainId, isConnected]);

  // Update refs
  useEffect(() => {
    prevAddressRef.current = address;
    prevConnectedRef.current = isConnected;
  }, [address, isConnected]);

  return null;
}
