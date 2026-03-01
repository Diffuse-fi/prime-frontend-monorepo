import type { AegisExitSelected, AegisExitStageInfo } from "./types";
import type { Address } from "viem";

import { vaultAbi } from "@diffuse/sdk-js";
import { useQuery } from "@tanstack/react-query";
import { getAddress } from "viem";

import { VaultFullInfo } from "../core/types";
import { opt, qk } from "../query/helpers";
import { QV } from "../query/versions";
import { useClients } from "../wagmi/useClients";
import { isEmptyDataLike, isInvalidDeadlineLike, toErr } from "./errors";

const ROOT = "aegisExitStage";
const version = QV.borrow;

const qKeys = {
  stage: (
    chainId: number | undefined,
    address: Address | undefined,
    positionId: bigint | undefined
  ) =>
    qk([
      ROOT,
      version,
      "stage",
      opt(chainId),
      opt(address),
      opt(positionId?.toString()),
    ]),
};

const buildMinAssetsOut = (routeLen: number) =>
  Array.from({ length: Math.max(1, routeLen) }, () => 0n);

const getLiveDeadline = () => BigInt(Math.floor(Date.now() / 1000) + 3600);

export function useAegisExitStage(
  selected: AegisExitSelected | null,
  vault: VaultFullInfo
) {
  const { address: wallet, chainId, publicClient } = useClients();

  const addr = selected ? getAddress(selected.address) : undefined;

  const enabled =
    !!selected &&
    !!vault &&
    selected.isAegisStrategy &&
    !!publicClient &&
    selected.chainId === chainId &&
    !!addr;

  const readReverseRoute = async (vaultAddress: Address, strategyId: bigint) => {
    const route = await publicClient!.readContract({
      abi: vaultAbi,
      address: vaultAddress,
      args: [strategyId],
      functionName: "reverseRoute",
    });
    return route as readonly Address[];
  };

  const simulateUnborrowEmptyData = async (
    vaultAddress: Address,
    positionId: bigint,
    strategyId: bigint
  ) => {
    const route = await readReverseRoute(vaultAddress, strategyId);
    const minAssetsOut = buildMinAssetsOut(route.length);
    const deadline = getLiveDeadline();

    const sim = await publicClient!.simulateContract({
      abi: vaultAbi,
      account: wallet ?? undefined,
      address: vaultAddress,
      args: [positionId, minAssetsOut, deadline, "0x"],
      functionName: "unborrow",
    });

    return sim.result;
  };

  const query = useQuery({
    enabled,
    queryFn: async (): Promise<AegisExitStageInfo> => {
      if (!selected || !addr) return { message: "Not ready", stage: -1 };
      if (!selected.isAegisStrategy)
        return { message: "Not an Aegis strategy", stage: -1 };

      const hasSwap = await publicClient!.readContract({
        abi: vaultAbi,
        address: addr,
        args: [selected.positionId],
        functionName: "hasUnfinishedSwap",
      });

      if (!hasSwap) return { message: "Exit not started", stage: 0 };

      try {
        const res = await simulateUnborrowEmptyData(
          addr,
          selected.positionId,
          selected.strategyId
        );

        const finished = Array.isArray(res)
          ? Boolean(res[2])
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Boolean((res as any)?.finished);

        if (finished) return { message: "Ready to finalize", stage: 3 };
        return { message: "Waiting for approval", stage: 2 };
      } catch (error) {
        if (isEmptyDataLike(error)) return { message: "Need encodedData", stage: 1 };
        if (isInvalidDeadlineLike(error))
          return { message: "Status check failed: expired deadline", stage: -1 };
        return { message: toErr(error).message, stage: -1 };
      }
    },
    queryKey: qKeys.stage(chainId, addr, selected?.positionId),
    refetchInterval: q => {
      const s = q.state.data?.stage;
      return s === 2 ? 60_000 : false;
    },
  });

  return query;
}
