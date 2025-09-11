"use client";

import { useVaults } from "@/lib/core/hooks/useVaults";
import { useRouter } from "next/navigation";
import { localizePath } from "@/lib/localization/locale";
import { useLocalization } from "@/lib/localization/useLocalization";
import { DollarSign, ArrowUpRight, Percent } from "lucide-react";
import { AssetsList } from "../AssetsList";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { Card } from "@diffuse/ui-kit";
import { useLenderPositions } from "@/lib/core/hooks/useLenderPositions";
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
  const { positions, isLoading: isLoadingPositions } =
    useLenderPositions(vaultsForSelectedAsset);

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Card cardBodyClassName="flex flex-row items-center justify-between gap-2">
          <div>
            <p className="text-muted-foreground text-sm">
              {dict.myPositions.totalSupplied}
            </p>
            <p className="text-2xl font-bold">--</p>
          </div>
          <DollarSign />
        </Card>
        <Card cardBodyClassName="flex flex-row items-center justify-between gap-2">
          <div>
            <p className="text-muted-foreground text-sm">{dict.myPositions.averageAPR}</p>
            <p className="text-2xl font-bold">--</p>
          </div>
          <ArrowUpRight />
        </Card>
        <Card cardBodyClassName="flex flex-row items-center justify-between gap-2">
          <div>
            <p className="text-muted-foreground text-sm">
              {dict.myPositions.interestEarned}
            </p>
            <p className="text-2xl font-bold">--</p>
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
        isLoading={isLoadingVaults}
        className="w-1/2"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4"></div>
    </div>
  );
}
