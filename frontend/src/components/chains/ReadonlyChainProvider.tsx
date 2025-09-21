"use client";

import { getAvailableChainsIds } from "@/lib/chains";
import {
  ActionsCtx,
  ReadonlyChainActions,
  ReadonlyChainState,
  StateCtx,
} from "@/lib/chains/ReadonlyChainContext";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { ReactNode, useMemo } from "react";

type ReadonlyChainProviderProps = {
  children?: ReactNode;
};

const availableChainIds = getAvailableChainsIds();

export function ReadonlyChainProvider({ children }: ReadonlyChainProviderProps) {
  const [state, setState] = useLocalStorage<ReadonlyChainState>(
    "readonly-chain:v1",
    {
      readonlyChainId: getAvailableChainsIds()[0],
      followWallet: true,
    },
    ({ readonlyChainId, followWallet }) =>
      Number.isInteger(readonlyChainId) &&
      availableChainIds.includes(readonlyChainId) &&
      typeof followWallet === "boolean"
  );

  const actions = useMemo<ReadonlyChainActions>(
    () => ({
      setReadonlyChainId: id =>
        setState(s => (s.readonlyChainId === id ? s : { ...s, readonlyChainId: id })),
      setFollowWallet: v =>
        setState(s => (s.followWallet === v ? s : { ...s, followWallet: v })),
    }),
    [setState]
  );

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}
