import { useMemo } from "react";
import { useClients } from "../wagmi/useClients";
import { useVaultRegistry } from "./useVaultRegistry";
import { Vault } from "@diffuse/sdk-js";
import { VaultWithAddress } from "./types";

export function useVaults(): VaultWithAddress[] {
  const { chainId, publicClient, walletClient } = useClients();
  const {
    allVaults: { data, error },
  } = useVaultRegistry();

  console.log("useVaults", { data, error });

  const vaults = useMemo(() => {
    if (!publicClient || !data) return [];

    return data.map(({ vault: vaultAddress, name }) => ({
      name,
      address: vaultAddress,
      vault: new Vault({
        address: vaultAddress,
        chainId,
        client: { public: publicClient, wallet: walletClient },
      }),
    }));
  }, [publicClient, walletClient, chainId, data]);

  return vaults;
}
