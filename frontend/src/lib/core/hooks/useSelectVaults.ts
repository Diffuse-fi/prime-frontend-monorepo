import { produce } from "immer";
import { useCallback, useState } from "react";

import { SelectedVault, VaultFullInfo } from "../types";

export function useSelectedVaults() {
  const [selectedVaults, setSelectedVaults] = useState<SelectedVault[]>([]);

  const setAmountForVault = useCallback((vault: VaultFullInfo, amount: bigint) => {
    setSelectedVaults(
      produce(draft => {
        const index = draft.findIndex(v => v.address === vault.address);
        const vaultNotAdded = index === -1;

        if (vaultNotAdded) {
          if (amount === 0n) {
            return;
          }

          // TODO - later support multiple assets per vault
          draft.push({
            address: vault.address,
            amount,
            assetAddress: vault.assets[0].address,
            assetDecimals: vault.assets[0].decimals,
            assetSymbol: vault.assets[0].symbol,
            chainId: vault.contract.chainId,
            legacyAllowance: vault.assets[0].legacyAllowance ?? false,
          });

          return;
        }

        if (amount === 0n) {
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

  return { reset, selectedVaults, setAmountForVault, setSelectedVaults };
}
