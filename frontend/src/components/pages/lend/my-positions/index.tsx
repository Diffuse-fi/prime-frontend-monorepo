"use client";

import { useVaults } from "@/lib/core/useVaults";
import { useRouter } from "next/navigation";
import { localizePath } from "@/lib/localization/locale";
import { useLocalization } from "@/lib/localization/useLocalization";
import { ExternalLink, DollarSign, ArrowUpRight, Percent } from "lucide-react";
import { AssetsList } from "../AssetsList";
import { useSelectedAsset } from "@/lib/core/useSelectedAsset";
import { Card, Text } from "@diffuse/ui-kit";

export default function MyPositions() {
  const { vaults, vaultsAssetsList, isPending } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);

  const router = useRouter();
  const { dict, lang, dir } = useLocalization();
  const onAddMoreLiquidity = () => router.push(localizePath("/lend/deposit", lang));

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Card cardBodyClassName="flex flex-row items-center justify-between gap-2">
          <div>
            <Text className="text-muted-foreground text-sm">
              {dict.myPositions.totalSupplied}
            </Text>
            <Text className="text-2xl font-bold">--</Text>
          </div>
          <DollarSign />
        </Card>
        <Card cardBodyClassName="flex flex-row items-center justify-between gap-2">
          <div>
            <Text className="text-muted-foreground text-sm">
              {dict.myPositions.averageAPR}
            </Text>
            <Text className="text-2xl font-bold">--</Text>
          </div>
          <ArrowUpRight />
        </Card>
        <Card cardBodyClassName="flex flex-row items-center justify-between gap-2">
          <div>
            <Text className="text-muted-foreground text-sm">
              {dict.myPositions.interestEarned}
            </Text>
            <Text className="text-2xl font-bold">--</Text>
          </div>
          <Percent />
        </Card>
      </div>
      <AssetsList
        skeletonsToShow={1}
        options={vaultsAssetsList}
        direction={dir}
        selectedAsset={selectedAsset}
        onSelectAsset={setSelectedAsset}
        isLoading={isPending}
      />
      <div></div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4"></div>
    </div>
  );
}
