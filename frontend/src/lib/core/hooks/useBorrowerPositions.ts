// lib/core/hooks/useBorrowerPositions.ts
import pLimit from "p-limit";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useClients } from "../../wagmi/useClients";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import type { Address } from "viem";
import type { VaultFullInfo } from "../types";
import type { BorrowerPosition } from "../types";

export type UseBorrowerPositionsResult = {
  positions: BorrowerPosition[];
  isLoading: boolean;
  isPending: boolean;
  refetch: () => void;
  error: Error | null;
};

const ROOT = "borrower-positions";
const version = QV.borrowerPositions;
const qKeys = {
  positions: (vaultsAddrKey: string | null, chainId: number, ownerAddr?: string) =>
    qk([ROOT, version, opt(vaultsAddrKey), chainId, opt(ownerAddr)]),
};

const LIMIT = pLimit(6);

export function useBorrowerPositions(
  allVaults: VaultFullInfo[]
): UseBorrowerPositionsResult {
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

          const asset = vault.assets[0];
          return raw.map(
            (p): BorrowerPosition => ({
              vault,
              asset,
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
  });

  return {
    positions: positionsQuery.data || [],
    isLoading: positionsQuery.isLoading,
    isPending: positionsQuery.isPending,
    refetch: positionsQuery.refetch,
    error: positionsQuery.error as Error | null,
  };
}
