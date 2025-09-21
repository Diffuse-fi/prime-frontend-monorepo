"use client";

import { createContext } from "react";

export type ReadonlyChainState = { readonlyChainId: number; followWallet: boolean };
export type ReadonlyChainActions = {
  setReadonlyChainId: (id: number) => void;
  setFollowWallet: (v: boolean) => void;
};

export const StateCtx = createContext<ReadonlyChainState | null>(null);
export const ActionsCtx = createContext<ReadonlyChainActions | null>(null);
