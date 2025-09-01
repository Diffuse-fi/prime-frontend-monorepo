"use client";

import { useVaults } from "../../../lib/core/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { Button, Card, Heading } from "@diffuse/ui-kit";
import { VaultCard } from "./VaultCard";
import { AssetsTolend } from "./AssetsToLend";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { useEffect } from "react";
import { TokenInfo, TokenInfoSchema } from "@/lib/tokens/validations";
import dedupe from "dedupe";
import { useSelectedVaults } from "@/lib/core/useSelectVaults";
import { useEnsureAllowances } from "@/lib/core/useEnsureAllowances";
import { showSkeletons } from "@/lib/misc/showSkeletons";

const validateTokenInfo = (value: TokenInfo | null) => {
  return TokenInfoSchema.safeParse(value).success;
};

export default function LendPage() {
  const { vaults, isPending } = useVaults();
  const tokenList = vaults.flatMap(v => v.assets ?? []);
  const { selectedVaults, setAmountForVault } = useSelectedVaults();
  const dedupedTokenList = dedupe(tokenList, t => t.address);
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(dedupedTokenList);
  const { dict } = useLocalization();
  const { ready, approveMissing } = useEnsureAllowances(selectedVaults);

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;

  return (
    <div className="grid sm:grid-cols-9 grid-cols-1 gap-2 sm:gap-4">
      <div className="flex flex-col gap-4 sm:col-span-4 col-span-1">
        <Card title={dict.lend.assetsToLend}>
          <Heading level={2}>{dict.lend.assetsToLend}</Heading>
          <AssetsTolend
            onSelectAsset={setSelectedAsset}
            selectedAsset={selectedAsset}
            isLoading={isPending}
            options={dedupedTokenList}
          />
        </Card>
        {isPending ? (
          showSkeletons(2, "h-50")
        ) : (
          <ul className="flex flex-col gap-2">
            {vaultsForSelectedAsset.map(vault => (
              <li key={vault.address}>
                <VaultCard
                  selectedAsset={selectedAsset!}
                  vault={vault}
                  amount={selectedVaults
                    .find(v => v.address === vault.address)
                    ?.amount.toString()}
                  onAmountChange={evt => {
                    const value = BigInt(evt.value || 0);
                    setAmountForVault(vault, value);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-4 sm:col-span-5 col-span-1">
        <Card>
          <Button onClick={() => approveMissing({ mode: "exact" })}>
            {dict.lend.enterAmountButtonText}
          </Button>
        </Card>
      </div>
    </div>
  );
}

function useSelectedAsset(allowedTokens: TokenInfo[]) {
  const [selectedAsset, setSelectedAsset] = useLocalStorage<TokenInfo | null>(
    "lend-selected-token",
    null,
    validateTokenInfo
  );

  useEffect(() => {
    if (!selectedAsset && allowedTokens.length > 0) {
      setSelectedAsset(allowedTokens[0]);
    }

    if (selectedAsset && !allowedTokens.find(t => t.address === selectedAsset.address)) {
      setSelectedAsset(allowedTokens.length > 0 ? allowedTokens[0] : null);
    }
  }, [allowedTokens, selectedAsset, setSelectedAsset]);

  return [selectedAsset, setSelectedAsset] as const;
}
