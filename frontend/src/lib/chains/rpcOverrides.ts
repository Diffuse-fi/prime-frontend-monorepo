import { CHAINS } from "@diffuse/config";
import { fallback, http } from "viem";
import z from "zod";

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

export const RpcOverrideModeSchema = z.enum(["off", "prepend", "only"]);
export const RpcOverridesSchema = z
  .string()
  .transform(v => JSON.parse(v))
  .pipe(
    z.record(
      z.union([
        z.string().min(1),
        z.array(z.string().min(1)).min(1),
      ])
    )
  )
  .transform(rec => {
    const out: Record<string, string[]> = {};

    for (const [k, v] of Object.entries(rec)) {
      const urls = (Array.isArray(v) ? v : [v]).map(x => x.trim()).filter(Boolean);
      if (urls.length > 0) out[k] = urls;
    }

    return out;
  });
