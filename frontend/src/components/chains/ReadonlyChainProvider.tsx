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
    },
    ({ readonlyChainId }) =>
      Number.isInteger(readonlyChainId) && availableChainIds.includes(readonlyChainId)
  );

  const actions = useMemo<ReadonlyChainActions>(
    () => ({
      setReadonlyChainId: id =>
        setState(s => (s.readonlyChainId === id ? s : { ...s, readonlyChainId: id })),
    }),
    [setState]
  );

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}
