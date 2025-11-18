import pLimit from "p-limit";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useClients } from "../../wagmi/useClients";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import type { Address } from "viem";
import type { VaultFullInfo } from "../types";
import type { BorrowerPosition } from "../types";

const ROOT = "borrower-positions";
const version = QV.borrowerPositions;
const qKeys = {
  positions: (vaultsAddrKey: string | null, chainId: number, ownerAddr?: string) =>
    qk([
      ROOT,
      version,
      opt(vaultsAddrKey),
      chainId,
      opt(ownerAddr),
      "positions",
    ]),
  pending: (vaultsAddrKey: string | null, chainId: number, ownerAddr?: string) =>
    qk([
      ROOT,
      version,
      opt(vaultsAddrKey),
      chainId,
      opt(ownerAddr),
      "pending-positions",
    ]),
  closed: (chainId: number, ownerAddr?: string) =>
    qk([ROOT, version, chainId, opt(ownerAddr), "closed-positions"]),
};

const LIMIT = pLimit(6);

export function useBorrowerPositions(allVaults: VaultFullInfo[]) {
  const { chainId, address: borrower, publicClient } = useClients();
  const vaultsConsistency = allVaults.every(v => v.contract.chainId === chainId);
  const addressKey = useMemo(() => {
    if (!allVaults?.length) return null;
    const sorted = [...allVaults].map(v => v.address.toLowerCase()).sort();
    return sorted.join("|");
  }, [allVaults]);

  const enabled =
    !!chainId &&
    !!publicClient &&
    !!addressKey &&
    !!borrower &&
    vaultsConsistency &&
    allVaults.length > 0;

  const pendingQuery = useQuery({
    enabled,
    queryKey: qKeys.pending(addressKey, chainId!, borrower),
    queryFn: async ({ signal }) => {
      const tasks = allVaults.map(vault =>
        LIMIT(async () => {
          const ids = await vault.contract.getPendingBorrowerPositionIds(
            borrower as Address,
            { signal }
          );

          return { vault, positionIds: ids as bigint[] };
        })
      );

      return Promise.all(tasks);
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const somePending = pendingQuery.data
    ? pendingQuery.data.some(p => p.positionIds.length > 0)
    : true;

  const positionsQuery = useQuery({
    enabled,
    queryKey: qKeys.positions(addressKey, chainId!, borrower),
    queryFn: async ({ signal }) => {
      const tasks = allVaults.map(vault =>
        LIMIT(async () => {
          const raw = await vault.contract.getActiveBorrowerPositions(
            borrower as Address,
            {
              signal,
            }
          );

          return raw.map(
            (p): BorrowerPosition => ({
              vault,
              asset: vault.strategies.find(s => s.id === p.strategyId)!.token,
              user: p.user as Address,
              collateralType: Number(p.collateralType),
              subjectToLiquidation: p.subjectToLiquidation,
              strategyId: p.strategyId,
              assetsBorrowed: p.assetsBorrowed,
              collateralGiven: p.collateralGiven,
              leverage: p.leverage,
              strategyBalance: p.strategyBalance,
              id: p.id,
              enterTimeOrDeadline: p.enterTimeOrDeadline,
              blockNumber: p.blockNumber,
              liquidationPrice: p.liquidationPrice,
            })
          );
        })
      );

      const perVault = await Promise.all(tasks);
      return perVault.flat();
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchInterval: somePending ? 2000 : false,
    refetchIntervalInBackground: somePending,
  });

  return {
    positions: positionsQuery.data || [],
    pending: pendingQuery.data || [],
    isLoading: positionsQuery.isLoading || pendingQuery.isLoading,
    isPending: positionsQuery.isPending || pendingQuery.isPending,
    refetchPending: pendingQuery.refetch,
    refetchPositions: positionsQuery.refetch,
    error: positionsQuery.error as Error | null,
    pendingError: pendingQuery.error as Error | null,
  };
}
