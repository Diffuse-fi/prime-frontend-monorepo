import { CHAINS } from "@diffuse/config";
import { fallback, http } from "viem";

import { env } from "@/env";

import { customRpcMap } from "./rpc";

export function transportsWithInjectedRpcOverrides(chains: typeof CHAINS) {
  const rpcMode = env.NEXT_PUBLIC_RPC_OVERRIDE_MODE ?? "off";
  const rpcOverrides = env.NEXT_PUBLIC_RPC_OVERRIDES ?? {};

  return Object.fromEntries(
    chains.map(chain => {
      const overrides = rpcOverrides[chain.id] ?? [];
      const base = [
        ...(customRpcMap[chain.id] ?? []),
        ...chain.rpcUrls.default.http,
      ];

      const urls =
        rpcMode === "only"
          ? overrides
          : rpcMode === "prepend"
            ? [...overrides, ...base]
            : base;

      if (rpcMode === "only" && urls.length === 0) {
        throw new Error(
          `RPC override mode is "only" but no RPC override provided for chainId=${chain.id}`
        );
      }

      if (urls.length === 0) {
        throw new Error(`No RPC URLs available for chainId=${chain.id}`);
      }

      const transport =
        urls.length <= 1 ? http(urls[0]!) : fallback(urls.map(u => http(u)));

      return [chain.id, transport];
    })
  );
}
