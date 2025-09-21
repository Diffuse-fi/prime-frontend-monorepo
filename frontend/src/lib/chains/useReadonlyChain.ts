"use client";

import { useReadonlyChainState } from "./ReadonlyChainContext";
import { getChainById } from ".";

export function useReadonlyChain() {
  const { readonlyChainId } = useReadonlyChainState();
  return { chain: getChainById(readonlyChainId), chainId: readonlyChainId };
}
