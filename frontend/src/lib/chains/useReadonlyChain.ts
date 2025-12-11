"use client";

import { getChainById } from ".";
import { useReadonlyChainState } from "./ReadonlyChainContext";

export function useReadonlyChain() {
  const { readonlyChainId } = useReadonlyChainState();
  return { chain: getChainById(readonlyChainId), chainId: readonlyChainId };
}
