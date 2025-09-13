"use client";

import { useVaults } from "@/lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { DollarSign, Percent, TrendingUp } from "lucide-react";
import { AssetsList } from "../AssetsList";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { Heading } from "@diffuse/ui-kit";
import { useLenderPositions } from "@/lib/core/hooks/useLenderPositions";
import { toast } from "@/lib/toast";
import { InfoCard, InfoCardProps } from "./InfoCard";
import { PositionCard } from "./PositionCard";
import { formatAsset } from "@/lib/formatters/asset";
import { useRouter } from "@/lib/localization/navigation";
import { useTranslations } from "next-intl";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAverageApr } from "@/lib/formulas";
import { showSkeletons } from "@/lib/misc/ui";

export default function MyPositions() {
  const {
    vaults,
    vaultsAssetsList,
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
  } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const router = useRouter();
  const { dir } = useLocalization();
  const t = useTranslations("myPositions");
  const onAddMoreLiquidity = () => router.push("/lend/deposit");
  const onWithDrawSuccess = () => {
    toast(t("toasts.withdrawSuccessToast"));
  };
  const onWithDrawError = () => {
    toast(t("toasts.withdrawErrorToast"));
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
  const totalAccrued =
    positions.length > 0
      ? positions.reduce((acc, p) => {
          const accrued = p.accruedYield;
          return acc + accrued;
        }, 0n)
      : 0n;

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {(
          [
            {
              header: t("totalSupplied"),
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
              header: t("averageAPY"),
              icon: <TrendingUp className="text-blue-500" />,
              info: vaults.length
                ? formatAprToPercent(calcAverageApr(vaults.map(v => v.targetApr))).text
                : "--",
              iconBgClassName: "bg-blue-100",
            },
            {
              header: t("interestEarned"),
              icon: <Percent className="text-purple-500" />,
              info:
                totalAccrued !== undefined && selectedAsset
                  ? `${
                      formatAsset(
                        totalAccrued,
                        selectedAsset.decimals,
                        selectedAsset.symbol
                      ).text
                    }`
                  : "--",
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
              {t("noPositions.title")}
            </Heading>
            <p className="">{t("noPositions.description")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
