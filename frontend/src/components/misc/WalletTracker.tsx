"use client";

import { useEffect, useRef } from "react";
import { useAccount, useAccountEffect, useChainId } from "wagmi";

import { trackEvent } from "@/lib/analytics";

export function WalletTracker() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const prevAddressRef = useRef<string | undefined>(undefined);
  const prevChainIdRef = useRef<number | undefined>(undefined);
  const prevConnectedRef = useRef<boolean>(false);

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

  useEffect(() => {
    prevAddressRef.current = address;
    prevConnectedRef.current = isConnected;
  }, [address, isConnected]);

  return null;
}
