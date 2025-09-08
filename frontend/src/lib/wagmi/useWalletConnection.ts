"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useSwitchChain } from "wagmi";

export type UseWalletConnectionParams = {
  onChainSwitch?: (args: { from: number | null; to: number }) => void;
};

export function useWalletConnection({ onChainSwitch }: UseWalletConnectionParams = {}) {
  const { address, isConnected, isConnecting, chainId, chain } = useAccount();
  const { connectors, isPending: isPendingConnection } = useConnect();
  const { isPending: isSwitchChainPending, variables: switchVars } = useSwitchChain();
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  const prevChainRef = useRef<number | null>(null);

  useEffect(() => {
    if (isConnected || isConnecting) {
      setHasAttemptedConnection(true);
    }
  }, [isConnected, isConnecting]);

  useEffect(() => {
    if (prevChainRef.current === null) {
      prevChainRef.current = chainId ?? null;
      return;
    }

    if (chainId === undefined || chainId === prevChainRef.current) return;

    const from = prevChainRef.current;
    const to = chainId!;

    onChainSwitch?.({ from, to });

    prevChainRef.current = chainId ?? null;
  }, [chainId, onChainSwitch]);

  return {
    address,
    isConnected,
    isConnecting,
    hasAttemptedConnection,
    connectors,
    isPendingConnection,
    isSwitchChainPending,
    switchVars,
    chain,
  };
}
