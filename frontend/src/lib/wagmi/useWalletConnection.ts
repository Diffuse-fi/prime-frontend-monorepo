"use client";

import { useEffect, useRef, useState } from "react";
import { Chain } from "viem";
import { useAccount, useConnect, useSwitchChain } from "wagmi";

export type UseWalletConnectionParams = {
  onChainSwitch?: (args: { from: Chain | null; to: Chain }) => void;
};

export function useWalletConnection({ onChainSwitch }: UseWalletConnectionParams = {}) {
  const { address, isConnected, isConnecting, chain } = useAccount();
  const { connectors, isPending: isPendingConnection } = useConnect();
  const { isPending: isSwitchChainPending, variables: switchVars } = useSwitchChain();
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  const prevChainRef = useRef<Chain | null>(null);

  useEffect(() => {
    if (isConnected || isConnecting) {
      setHasAttemptedConnection(true);
    }
  }, [isConnected, isConnecting]);

  useEffect(() => {
    if (prevChainRef.current === null) {
      prevChainRef.current = chain ?? null;
      return;
    }

    if (
      chain === undefined ||
      (prevChainRef.current !== null && chain?.id === prevChainRef.current.id)
    )
      return;

    const from = prevChainRef.current;
    const to = chain;

    onChainSwitch?.({ from, to });

    prevChainRef.current = chain ?? null;
  }, [chain, onChainSwitch]);

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
