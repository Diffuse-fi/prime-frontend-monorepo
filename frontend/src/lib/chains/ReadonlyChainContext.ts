"use client";

import { createContext, useContext } from "react";

export type ReadonlyChainState = { readonlyChainId: number; followWallet: boolean };
export type ReadonlyChainActions = {
  setReadonlyChainId: (id: number) => void;
  setFollowWallet: (v: boolean) => void;
};

export const StateCtx = createContext<ReadonlyChainState | null>(null);
export const ActionsCtx = createContext<ReadonlyChainActions | null>(null);

export function useReadonlyChainState() {
  const ctx = useContext(StateCtx);

  if (!ctx)
    throw new Error("useReadonlyChainState must be used within ReadonlyChainProvider");

  return ctx;
}

export function useReadonlyChainActions() {
  const ctx = useContext(ActionsCtx);

  if (!ctx)
    throw new Error("useReadonlyChainActions must be used within ReadonlyChainProvider");

  return ctx;
}
