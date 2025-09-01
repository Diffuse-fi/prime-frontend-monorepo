import { useState } from "react";
import { SelectedVault, VaultFullInfo } from "./types";
import { produce } from "immer";

export function useSelectedVaults() {
  const [selectedVaults, setSelectedVaults] = useState<SelectedVault[]>([]);

  const setAmountForVault = (vault: VaultFullInfo, amount: bigint) => {
    setSelectedVaults(
      produce(draft => {
        const index = draft.findIndex(v => v.address === vault.address);
        const vaultNotAdded = index === -1;

        if (vaultNotAdded) {
          if (amount === BigInt(0)) {
            return;
          }

          draft.push({
            address: vault.address,
            assetAddress: vault.assets[0].address,
            assetSymbol: vault.assets[0].symbol,
            assetDecimals: vault.assets[0].decimals,
            amount,
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
  };

  return { selectedVaults, setSelectedVaults, setAmountForVault };
}
