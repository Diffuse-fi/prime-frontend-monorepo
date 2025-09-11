import pLimit from "p-limit";
import { LenderPosition, VaultFullInfo } from "../types";
import { QV } from "../../query/versions";
import { opt, qk } from "../../query/helpers";
import { useMemo } from "react";
import { useClients } from "../../wagmi/useClients";
import { useQuery } from "@tanstack/react-query";

export type UseLenderPositionsResult = {
  positions: LenderPosition[];
  isLoading: boolean;
  isPending: boolean;
  refetch: () => void;
  error: Error | null;
};

const ROOT = "lender-positions";
const version = QV.lenderPositions;
const qKeys = {
  positions: (vaultsAddrkey: string | null, chainId: number, ownerAddr?: string) =>
    qk([ROOT, version, opt(vaultsAddrkey), chainId, opt(ownerAddr)]),
};

const LIMIT = pLimit(6);

export function useLenderPositions(allVaults: VaultFullInfo[]) {
  const { chainId, address: lender, publicClient } = useClients();
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
    !!lender &&
    vaultsConsistency &&
    allVaults.length > 0;

  const positionsQueries = useQuery({
    enabled,
    queryKey: qKeys.positions(addressKey, chainId, lender),
    queryFn: async ({ signal }) => {
      const tasks = allVaults.map(vault =>
        LIMIT(async () => {
          try {
            const strategyIds =
              vault.strategies.length > 0
                ? vault.strategies.map((_, i) => BigInt(i))
                : []; // if empty allowed; otherwise handle below

            // if (strategyIds.length === 0) {
            //   // If the contract reverts on empty, skip querying accrued yield
            //   const balance = await vault.contract.getLenderBalance(lender!, { signal });

            //   return {
            //     vaultAddress: vault.address,
            //     asset: vault.assets[0],
            //     balance,
            //     aquiredYield: 0n as const,
            //   };
            // }

            const [accruedYieldData, balance] = await Promise.all([
              vault.contract.accruedLenderYield(strategyIds, lender!, { signal }),
              vault.contract.getLenderBalance(lender!, { signal }),
            ]);

            return {
              vaultAddress: vault.address,
              asset: vault.assets[0],
              balance,
              aquiredYield: accruedYieldData[0],
            };
          } catch (e) {
            throw e;
          }
        })
      );

      return Promise.all(tasks);
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
  });

  return {
    positions: positionsQueries.data || [],
    isLoading: positionsQueries.isLoading,
    isPending: positionsQueries.isPending,
    refetch: positionsQueries.refetch,
    error: positionsQueries.error,
  };
}
