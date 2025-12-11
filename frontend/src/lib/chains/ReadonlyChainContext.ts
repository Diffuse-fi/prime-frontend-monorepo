"use client";

import { createContext, useContext } from "react";

export type ReadonlyChainActions = {
  setReadonlyChainId: (id: number) => void;
};
export type ReadonlyChainState = { readonlyChainId: number };

export const StateCtx = createContext<null | ReadonlyChainState>(null);
export const ActionsCtx = createContext<null | ReadonlyChainActions>(null);

export function useReadonlyChainActions() {
  const ctx = useContext(ActionsCtx);

  if (!ctx)
    throw new Error("useReadonlyChainActions must be used within ReadonlyChainProvider");

  return ctx;
}

export function useReadonlyChainState() {
  const ctx = useContext(StateCtx);

  if (!ctx)
    throw new Error("useReadonlyChainState must be used within ReadonlyChainProvider");

  return ctx;
}
