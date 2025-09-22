"use client";

import { useEffect, useRef } from "react";
import { useChainId } from "wagmi";

type OnSwitch = (ctx: { prevChainId: number | null; chainId: number }) => void;

export function useOnChainSwitch(
  onSwitch: OnSwitch,
  opts: { runOnMount?: boolean } = {}
) {
  const chainId = useChainId();
  const prevRef = useRef<number | null>(null);
  const { runOnMount = false } = opts;

  useEffect(() => {
    if (chainId == null) return;

    const prev = prevRef.current;

    const changed = prev !== null && prev !== chainId;

    if ((runOnMount && prev === null) || changed) {
      onSwitch({ prevChainId: prev, chainId });
    }

    prevRef.current = chainId;
  }, [chainId, onSwitch, runOnMount]);
}
