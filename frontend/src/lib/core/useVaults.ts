import { useMemo } from "react";
import { useClients } from "../wagmi/useClients";
import { useVaultRegistry } from "./useVaultRegistry";
import { Vault } from "@diffuse/sdk-js";
import { VaultWithAddress } from "./types";

export function useVaults(): VaultWithAddress[] {
  const { chainId, publicClient, walletClient } = useClients();
  const { allVaults } = useVaultRegistry();

  const vaults = useMemo(() => {
    if (!publicClient || !allVaults) return [];

    return allVaults.map(({ vault: vaultAddress, name, targetApr }) => ({
      name,
      address: vaultAddress,
      targetApr,
      vault: new Vault({
        address: vaultAddress,
        chainId,
        client: { public: publicClient, wallet: walletClient },
      }),
    }));
  }, [publicClient, walletClient, chainId, allVaults]);

  return vaults;
}
