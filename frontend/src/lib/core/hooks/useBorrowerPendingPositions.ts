import pLimit from "p-limit";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useClients } from "../../wagmi/useClients";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import type { Address } from "viem";
import type { VaultFullInfo } from "../types";

export type PendingPositionIdsByVault = {
  vault: VaultFullInfo;
  positionIds: bigint[];
};

export type UsePendingBorrowerPositionIdsResult = {
  pending: PendingPositionIdsByVault[];
  isLoading: boolean;
  isPending: boolean;
  refetch: () => void;
  error: Error | null;
};

const ROOT = "borrower-pending-positions";
const version = QV.borrowerPositions;
const qKeys = {
  pending: (vaultsAddrKey: string | null, chainId: number, ownerAddr?: string) =>
    qk([ROOT, version, opt(vaultsAddrKey), chainId, opt(ownerAddr)]),
};

const LIMIT = pLimit(6);

export function usePendingBorrowerPositionIds(
  allVaults: VaultFullInfo[]
): UsePendingBorrowerPositionIdsResult {
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

          return { vault, positionIds: ids as bigint[] } as PendingPositionIdsByVault;
        })
      );

      return Promise.all(tasks);
    },
    staleTime: 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    pending: pendingQuery.data || [],
    isLoading: pendingQuery.isLoading,
    isPending: pendingQuery.isPending,
    refetch: pendingQuery.refetch,
    error: pendingQuery.error as Error | null,
  };
}
