import { useState, useCallback } from "react";
import { SelectedVault, VaultFullInfo } from "../types";
import { produce } from "immer";

export function useSelectedVaults() {
  const [selectedVaults, setSelectedVaults] = useState<SelectedVault[]>([]);

  const setAmountForVault = useCallback((vault: VaultFullInfo, amount: bigint) => {
    setSelectedVaults(
      produce(draft => {
        const index = draft.findIndex(v => v.address === vault.address);
        const vaultNotAdded = index === -1;

        if (vaultNotAdded) {
          if (amount === BigInt(0)) {
            return;
          }

          // TODO - later support multiple assets per vault
          draft.push({
            address: vault.address,
            assetAddress: vault.assets[0].address,
            assetSymbol: vault.assets[0].symbol,
            assetDecimals: vault.assets[0].decimals,
            amount,
            legacyAllowance: vault.assets[0].legacyAllowance ?? false,
            chainId: vault.contract.chainId,
          });

          return;
        }

        if (amount === BigInt(0)) {
          draft.splice(index, 1);
          return;
        }

        draft[index].amount = amount;
      })
    );
  }, []);

  const reset = useCallback(() => {
    setSelectedVaults([]);
  }, []);

  return { selectedVaults, setSelectedVaults, setAmountForVault, reset };
}
