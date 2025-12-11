"use client";

import { useEffect, useRef } from "react";
import { useChainId } from "wagmi";

type OnSwitch = (ctx: { chainId: number; prevChainId: null | number }) => void;

export function useOnChainSwitch(
  onSwitch: OnSwitch,
  opts: { runOnMount?: boolean } = {}
) {
  const chainId = useChainId();
  const prevRef = useRef<null | number>(null);
  const { runOnMount = false } = opts;

  useEffect(() => {
    if (chainId == undefined) return;

    const prev = prevRef.current;

    const changed = prev !== null && prev !== chainId;

    if ((runOnMount && prev === null) || changed) {
      onSwitch({ chainId, prevChainId: prev });
    }

    prevRef.current = chainId;
  }, [chainId, onSwitch, runOnMount]);
}
