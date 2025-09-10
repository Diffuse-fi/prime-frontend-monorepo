"use client";

import { QV } from "../query/versions";
import { useQuery } from "@tanstack/react-query";
import { opt, qk } from "../query/helpers";
import { useVaultRegistryContract } from "./useVaultRegistryContract";
import { Address, getAddress } from "viem";
import { useChainId } from "wagmi";

type UseVaultRegistryParams = {
  addressOverride?: Address;
};

const ROOT = "vaultRegistry" as const;
const version = QV.vaultsList;

const queryKeys = {
  allVaults: (contractAddress: Address | null, chainId: number) =>
    qk([ROOT, version, opt(contractAddress), chainId]),
};

export function useVaultRegistry({ addressOverride }: UseVaultRegistryParams = {}) {
  const chainId = useChainId();
  const normalizedAddr = addressOverride ? getAddress(addressOverride) : undefined;
  const registry = useVaultRegistryContract(normalizedAddr);

  const vaultsQuery = useQuery({
    enabled: !!registry && !!chainId,
    queryKey: queryKeys.allVaults(addressOverride || null, chainId),
    queryFn: ({ signal }) => registry!.getVaults({ signal }),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });

  return {
    allVaults: vaultsQuery.data,
    isPending: vaultsQuery.isPending,
    isLoading: vaultsQuery.isLoading,
    error: vaultsQuery.error,
    refetch: () => vaultsQuery.refetch(),
  };
}
