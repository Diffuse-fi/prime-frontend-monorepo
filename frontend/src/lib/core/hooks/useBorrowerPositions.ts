import type { VaultFullInfo } from "../types";
import type { BorrowerPosition } from "../types";

import { useQuery } from "@tanstack/react-query";
import pLimit from "p-limit";
import { useMemo } from "react";
import { type Address } from "viem";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";

const ROOT = "borrower-positions";
const version = QV.borrowerPositions;
const qKeys = {
  closed: (chainId: number, ownerAddr?: string) =>
    qk([ROOT, version, chainId, opt(ownerAddr), "closed-positions"]),
  pending: (vaultsAddrKey: null | string, chainId: number, ownerAddr?: string) =>
    qk([
      ROOT,
      version,
      opt(vaultsAddrKey),
      chainId,
      opt(ownerAddr),
      "pending-positions",
    ]),
  positions: (vaultsAddrKey: null | string, chainId: number, ownerAddr?: string) =>
    qk([
      ROOT,
      version,
      opt(vaultsAddrKey),
      chainId,
      opt(ownerAddr),
      "positions",
    ]),
};

const LIMIT = pLimit(6);

export function useBorrowerPositions(allVaults: VaultFullInfo[]) {
  const { address: borrower, chainId, publicClient } = useClients();
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
    gcTime: 10 * 60_000,
    queryFn: async ({ signal }) => {
      const tasks = allVaults.map(vault =>
        LIMIT(async () => {
          const ids = await vault.contract.getPendingBorrowerPositionIds(
            borrower as Address,
            { signal }
          );

          return { positionIds: ids as bigint[], vault };
        })
      );

      return Promise.all(tasks);
    },
    queryKey: qKeys.pending(addressKey, chainId!, borrower),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  });

  const somePending = pendingQuery.data
    ? pendingQuery.data.some(p => p.positionIds.length > 0)
    : true;

  const positionsQuery = useQuery({
    enabled,
    gcTime: 10 * 60_000,
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
              asset: vault.strategies.find(s => s.id === p.strategyId)!.token,
              assetsBorrowed: p.assetsBorrowed,
              blockNumber: p.blockNumber,
              collateralGiven: p.collateralGiven,
              collateralType: Number(p.collateralType),
              enterTimeOrDeadline: p.enterTimeOrDeadline,
              id: p.id,
              leverage: p.leverage,
              liquidationPrice: p.liquidationPrice,
              strategyBalance: p.strategyBalance,
              strategyId: p.strategyId,
              subjectToLiquidation: p.subjectToLiquidation,
              user: p.user as Address,
              vault,
            })
          );
        })
      );

      const perVault = await Promise.all(tasks);
      return perVault.flat();
    },
    queryKey: qKeys.positions(addressKey, chainId!, borrower),
    refetchInterval: somePending ? 2000 : false,
    refetchIntervalInBackground: somePending,
    staleTime: 30_000,
  });

  return {
    error: positionsQuery.error as Error | null,
    isLoading: positionsQuery.isLoading || pendingQuery.isLoading,
    isPending: positionsQuery.isPending || pendingQuery.isPending,
    pending: pendingQuery.data || [],
    pendingError: pendingQuery.error as Error | null,
    positions: positionsQuery.data || [],
    refetchPending: pendingQuery.refetch,
    refetchPositions: positionsQuery.refetch,
  };
}
