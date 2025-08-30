"use client";

import { QV } from "../query/versions";
import { useQuery } from "@tanstack/react-query";
import { opt, qk } from "../query/helpers";
import { useVaultRegistryContract } from "./useVaultRegistryContract";
import { Address, getAddress } from "viem";

type UseVaultRegistryParams = {
  addressOverride?: Address;
};

const ROOT = "vaultRegistry" as const;
const version = QV.vaultsList;

const queryKeys = {
  allVaults: (contractAddress: Address | null) =>
    qk([ROOT, version, opt(contractAddress), "allVaults"]),
};

export function useVaultRegistry({ addressOverride }: UseVaultRegistryParams = {}) {
  const normalizedAddr = addressOverride ? getAddress(addressOverride) : undefined;
  const registry = useVaultRegistryContract(normalizedAddr);

  const data = useQuery({
    enabled: !!registry,
    queryKey: queryKeys.allVaults(addressOverride || null),
    queryFn: async () => registry!.getVaults(),
    staleTime: 30_000,
  });

  return {
    allVaults: data.data,
    isLoading: data.isLoading,
    error: data.error,
  };
}
