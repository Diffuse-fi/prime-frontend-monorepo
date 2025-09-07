"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useSwitchChain } from "wagmi";

export function useWalletConnection() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, isPending: isPendingConnection } = useConnect();
  const { isPending: isSwitchChainPending, variables: switchVars } = useSwitchChain();
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  useEffect(() => {
    if (isConnected || isConnecting) {
      setHasAttemptedConnection(true);
    }
  }, [isConnected, isConnecting]);

  return {
    address,
    isConnected,
    isConnecting,
    hasAttemptedConnection,
    connectors,
    isPendingConnection,
    isSwitchChainPending,
    switchVars,
  };
}
