import type { Address, Hash, Hex, PublicClient, WalletClient } from "viem";

import { vaultAbi, viewerAbi } from "@diffuse/sdk-js";
import { getAddress } from "viem";

export function makeSdkAegisExitAdapter(args: {
  chainId: number;
  publicClient: PublicClient;
  vaultAddress: Address;
  viewerAddress: Address;
  walletClient: WalletClient;
}) {
  const vault = getAddress(args.vaultAddress);
  const viewer = getAddress(args.viewerAddress);

  async function getMinAssetsOutTemplate(positionId: bigint) {
    const pos = await args.publicClient.readContract({
      abi: vaultAbi,
      address: vault,
      args: [positionId],
      functionName: "getBorrowerPosition",
    });
    const minAssetsOutLen = pos.minAssetsOut.length as number;
    return Array.from({ length: minAssetsOutLen }, () => 0n);
  }

  return {
    async getReverseRouteInfoForPosition(positionId: bigint) {
      return (await args.publicClient.readContract({
        abi: viewerAbi,
        address: viewer,
        args: [vault, positionId],
        functionName: "getReverseRouteInfoForPosition",
      })) as readonly Hex[];
    },

    async hasUnfinishedSwap(positionId: bigint) {
      return await args.publicClient.readContract({
        abi: vaultAbi,
        address: vault,
        args: [positionId],
        functionName: "hasUnfinishedSwap",
      });
    },

    async simulateUnborrowEmptyData({
      deadline,
      positionId,
    }: {
      deadline: bigint;
      positionId: bigint;
      strategyId: bigint;
    }) {
      const minAssetsOut = await getMinAssetsOutTemplate(positionId);

      const sim = await args.publicClient.simulateContract({
        abi: vaultAbi,
        account: args.walletClient.account!,
        address: vault,
        args: [positionId, minAssetsOut, deadline, "0x"],
        functionName: "unborrow",
      });

      const [returned, _, finished] = sim.result as unknown as [
        readonly bigint[],
        bigint,
        boolean,
      ];

      return { finished, returned };
    },

    async writeUnborrow({
      deadline,
      encodedData,
      positionId,
    }: {
      deadline: bigint;
      encodedData: Hex;
      positionId: bigint;
      strategyId: bigint;
    }): Promise<Hash> {
      const minAssetsOut = await getMinAssetsOutTemplate(positionId);

      const sim = await args.publicClient.simulateContract({
        abi: vaultAbi,
        account: args.walletClient.account!,
        address: vault,
        args: [positionId, minAssetsOut, deadline, encodedData],
        functionName: "unborrow",
      });

      return await args.walletClient.writeContract(sim.request);
    },
  };
}
