"use client";

import { useContext } from "react";
import { ActionsCtx, StateCtx } from "./ReadonlyChainContext";
import { getChainById } from ".";

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

export function useReadonlyChain() {
  const { readonlyChainId } = useReadonlyChainState();
  return { chain: getChainById(readonlyChainId), chainId: readonlyChainId };
}
