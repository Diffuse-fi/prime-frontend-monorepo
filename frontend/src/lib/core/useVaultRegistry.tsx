"use client";

import { QV } from "../query/versions";
import { useQuery } from "@tanstack/react-query";
import { opt, qk } from "../query/helpers";
import { useVaultRegistryContract } from "./useVaultRegistryContract";
import { Address, getAddress } from "viem";
import { raceSignal as abortable } from "race-signal";

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
    queryFn: ({ signal }) => abortable(registry!.getVaults(), signal),
    staleTime: 30_000,
  });

  return {
    allVaults: data.data,
    isPending: data.isPending,
    error: data.error,
  };
}
