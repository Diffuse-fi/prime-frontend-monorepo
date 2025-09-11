"use client";

import { useVaults } from "@/lib/core/hooks/useVaults";
import { useRouter } from "next/navigation";
import { localizePath } from "@/lib/localization/locale";
import { useLocalization } from "@/lib/localization/useLocalization";
import { DollarSign, Percent, TrendingUp } from "lucide-react";
import { AssetsList } from "../AssetsList";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { Card, Heading } from "@diffuse/ui-kit";
import { useLenderPositions } from "@/lib/core/hooks/useLenderPositions";
import { toast } from "@/lib/toast";
import { InfoCard, InfoCardProps } from "./InfoCard";
import { showSkeletons } from "@/lib/misc/showSkeletons";
import { PositionCard } from "./PositionCard";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";

export default function MyPositions() {
  const {
    vaults,
    vaultsAssetsList,
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
  } = useVaults();
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
  const totalSupplied =
    vaults.length > 0
      ? vaults.reduce((acc, v) => {
          const totalInVault = v.totalAssets ?? 0n;
          return acc + totalInVault;
        }, 0n)
      : 0n;

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {(
          [
            {
              header: dict.myPositions.totalSupplied,
              icon: <DollarSign className="text-primary" />,
              info:
                totalSupplied && selectedAsset
                  ? formatAsset(
                      totalSupplied,
                      selectedAsset.decimals,
                      selectedAsset.symbol
                    ).text
                  : "--",
              iconBgClassName: "bg-primary/20",
            },
            {
              header: dict.myPositions.averageAPY,
              icon: <TrendingUp className="text-blue-500" />,
              info: "--",
              iconBgClassName: "bg-blue-100",
            },
            {
              header: dict.myPositions.interestEarned,
              icon: <Percent className="text-purple-500" />,
              info: "--",
              iconBgClassName: "bg-purple-100",
            },
          ] satisfies InfoCardProps[]
        ).map(i => (
          <InfoCard
            key={i.header}
            header={i.header}
            icon={i.icon}
            info={i.info}
            iconBgClassName={i.iconBgClassName}
          />
        ))}
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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
        {isLoadingPositions || isPendingVaults ? (
          showSkeletons(3, "h-40 sm:h-50")
        ) : positions.length > 0 ? (
          positions.map(position => (
            <PositionCard
              position={position}
              key={position.vault.address}
              onWithDrawSuccess={onWithDrawSuccess}
              onWithDrawError={onWithDrawError}
            />
          ))
        ) : (
          <div className="sm:col-span-3">
            <Heading level="5" className="pt-2 font-semibold">
              {dict.myPositions.noPositions.title}
            </Heading>
            <p className="">{dict.myPositions.noPositions.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
