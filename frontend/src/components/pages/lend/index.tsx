"use client";

import { useVaults } from "@/lib/core/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { Button, Card, Heading } from "@diffuse/ui-kit";
import { VaultCard } from "./VaultCard";
import { AssetsTolend } from "./AssetsToLend";
import { useLocalStorage } from "@/lib/ui/useLocalStorage";
import { useAllowedAssets } from "../../../lib/tokens/useAllowedAssets";
import { isAddress } from "viem";

const validateTokenInfo = (value: string | null) => {
  return !!value ? isAddress(value) : false;
};

export default function LendPage() {
  const [selectedToken, setSelectedToken] = useLocalStorage<string | null>(
    "lend-selected-token",
    null,
    validateTokenInfo
  );
  const { dict } = useLocalization();
  const { tokensList, isLoading } = useAllowedAssets();
  const vaults = useVaults();

  return (
    <div className="grid sm:grid-cols-9 grid-cols-1 gap-2 sm:gap-4">
      <div className="flex flex-col gap-4 sm:col-span-4 col-span-1">
        <Card title={dict.lend.assetsToLend}>
          <Heading level={2}>{dict.lend.assetsToLend}</Heading>
          <AssetsTolend
            onSelectAsset={setSelectedToken}
            selectedAsset={selectedToken}
            isLoading={isLoading}
            options={tokensList}
          />
        </Card>
        <ul className="flex flex-col gap-2">
          {vaults.map(vault => (
            <li key={vault.address}>
              <VaultCard vault={vault} />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-5 col-span-1">
        <Card>
          <Button disabled>{dict.lend.enterAmountButtonText}</Button>
        </Card>
      </div>
    </div>
  );
}
