"use client";

import { useVaults } from "@/lib/core/useVaults";
import { useRouter } from "next/navigation";
import { localizePath } from "@/lib/localization/locale";
import { useLocalization } from "@/lib/localization/useLocalization";
import { ExternalLink, DollarSign, ArrowUpRight, Percent } from "lucide-react";
import { AssetsList } from "../AssetsList";
import { useSelectedAsset } from "@/lib/core/useSelectedAsset";
import { Card, Text } from "@diffuse/ui-kit";
import { PositionsFilter } from "./PositionsFilter";
import { usePositionsFilter } from "@/lib/core/usePositionsFilter";
import { useLenderPositions } from "@/lib/core/useLenderPositions";
import { toast } from "@/lib/toast";

export default function MyPositions() {
  const { vaults, vaultsAssetsList, isLoading: isLoadingVaults } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const router = useRouter();
  const { dict, lang, dir } = useLocalization();
  const onAddMoreLiquidity = () => router.push(localizePath("/lend/deposit", lang));
  const onWithDrawSuccess = () => {
    toast(dict.myPositions.toasts.withdrawSuccessToast);
  };
  const onWithDrawError = () => {
    toast(dict.myPositions.toasts.withdrawErrorToast);
  };
  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const {
    positions,
    isLoading: isLoadingPositions,
    error,
  } = useLenderPositions(vaultsForSelectedAsset);
  const { filteredPositions } = usePositionsFilter(positions);
  const isLoading = isLoadingVaults || isLoadingPositions;

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
        isLoading={isLoading}
      />
      <PositionsFilter isLoading={isLoading} className="sm:w-1/3" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4"></div>
    </div>
  );
}
