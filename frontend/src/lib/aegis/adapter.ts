import type { Address, Hash, Hex, PublicClient, WalletClient } from "viem";

import { Vault, Viewer } from "@diffuse/sdk-js";
import { getAddress } from "viem";

export type AegisExitAdapter = {
  getReverseRouteInfoForPosition: (positionId: bigint) => Promise<readonly Hex[]>;
  hasUnfinishedSwap: (positionId: bigint) => Promise<boolean>;
  reverseRouteLength: (strategyId: bigint) => Promise<number>;
  simulateUnborrowEmptyData: (args: {
    deadline: bigint;
    positionId: bigint;
    strategyId: bigint;
  }) => Promise<{ finished: boolean; returned: readonly bigint[] }>;
  writeUnborrow: (args: {
    deadline: bigint;
    encodedData: Hex;
    positionId: bigint;
    strategyId: bigint;
  }) => Promise<Hash>;
};

export function makeSdkAegisExitAdapter(args: {
  chainId: number;
  publicClient: PublicClient;
  vaultAddress: Address;
  walletClient: WalletClient;
}) {
  const vault = new Vault({
    address: getAddress(args.vaultAddress),
    chainId: args.chainId,
    client: { public: args.publicClient, wallet: args.walletClient },
  });

  const viewer = new Viewer({
    chainId: args.chainId,
    client: { public: args.publicClient },
  });

  const adapter: AegisExitAdapter = {
    getReverseRouteInfoForPosition: async (positionId: bigint) => {
      return (await viewer.getReverseRouteInfoForPosition(
        getAddress(args.vaultAddress),
        positionId
      )) as readonly Hex[];
    },
    hasUnfinishedSwap: async (positionId: bigint) => {
      return await vault.hasUnfinishedSwap(positionId);
    },
    reverseRouteLength: async (strategyId: bigint) => {
      const route = (await vault.reverseRoute(strategyId)) as readonly unknown[];
      return route.length;
    },
    simulateUnborrowEmptyData: async ({ deadline, positionId, strategyId }) => {
      const route = (await vault.reverseRoute(strategyId)) as readonly unknown[];
      const minAssetsOut = Array.from({ length: route.length }, () => 0n);
      const res = await vault.callStatic.unborrow(
        positionId,
        minAssetsOut,
        deadline,
        "0x"
      );
      return {
        finished: !!res.finished,
        returned: (res.returned ?? []) as readonly bigint[],
      };
    },
    writeUnborrow: async ({ deadline, encodedData, positionId, strategyId }) => {
      const route = (await vault.reverseRoute(strategyId)) as readonly unknown[];
      const minAssetsOut = Array.from({ length: route.length }, () => 0n);
      return await vault.unborrow(positionId, minAssetsOut, deadline, encodedData);
    },
  };

  return adapter;
}
