import { useQuery } from "@tanstack/react-query";
import pLimit from "p-limit";
import { useMemo } from "react";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { LenderPosition, VaultFullInfo } from "../types";

export type UseLenderPositionsResult = {
  error: Error | null;
  isLoading: boolean;
  isPending: boolean;
  positions: LenderPosition[];
  refetch: () => void;
};

const ROOT = "lender-positions";
const version = QV.lenderPositions;
const qKeys = {
  positions: (vaultsAddrkey: null | string, chainId: number, ownerAddr?: string) =>
    qk([ROOT, version, opt(vaultsAddrkey), chainId, opt(ownerAddr)]),
};

const LIMIT = pLimit(6);

export function useLenderPositions(allVaults: VaultFullInfo[]) {
  const { address: lender, chainId, publicClient } = useClients();
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
    gcTime: 1000 * 60 * 10,
    queryFn: async ({ signal }) => {
      const tasks = allVaults.map(vault =>
        LIMIT(async () => {
          const strategiesLength = await vault.contract.getStrategylength({ signal });
          const strategyIds =
            vault.strategies.length > 0
              ? Array.from({ length: Number(strategiesLength) }, (_, i) => BigInt(i))
              : [];

          const [accruedYieldData, balance] = await Promise.all([
            vault.contract.accruedLenderYield(strategyIds, lender!, { signal }),
            vault.contract.getLenderBalance(lender!, { signal }),
          ]);

          if (balance === 0n && accruedYieldData.every(y => y === 0n)) {
            return null;
          }

          return {
            accruedYield: accruedYieldData[0],
            asset: vault.assets[0],
            balance,
            vault: vault,
          };
        })
      );

      return Promise.all(tasks);
    },
    queryKey: qKeys.positions(addressKey, chainId, lender),
    staleTime: 1000 * 30,
  });

  const positions =
    positionsQueries.data && positionsQueries.data?.length > 0
      ? positionsQueries.data.filter((p): p is LenderPosition => p !== null)
      : [];

  return {
    error: positionsQueries.error,
    isLoading: positionsQueries.isLoading,
    isPending: positionsQueries.isPending,
    positions,
    refetch: positionsQueries.refetch,
  };
}
