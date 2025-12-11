"use client";

import { Button, Heading, Tooltip } from "@diffuse/ui-kit";
import { DollarSign, Percent, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLenderPositions } from "@/lib/core/hooks/useLenderPositions";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { useWithdrawYield } from "@/lib/core/hooks/useWithdrawYield";
import { LenderPosition } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { compareDatish } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprByInterestEarned } from "@/lib/formulas/apr";
import { useLocalization } from "@/lib/localization/useLocalization";
import { showSkeletons } from "@/lib/misc/ui";
import { toast } from "@/lib/toast";

import { AssetsList } from "../../../AssetsList";
import { InfoCard, InfoCardProps } from "./InfoCard";
import { PositionCard } from "./PositionCard";
import { WithdrawModal } from "./WithdrawModal";

export default function MyPositions() {
  const {
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
    refetch: refetchVaults,
    refetchLimits,
    refetchTotalAssets,
    vaults,
    vaultsAssetsList,
  } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const [selectedPosition, setSelectedPosition] = useState<LenderPosition | null>(null);

  const { dir } = useLocalization();
  const t = useTranslations("myPositions");

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const {
    isLoading: isLoadingPositions,
    positions,
    refetch,
  } = useLenderPositions(vaultsForSelectedAsset);
  const totalSupplied =
    positions.length > 0
      ? positions.reduce((acc, p) => {
          const totalInVault = p.balance ?? 0n;
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

  const onWithdrawSuccess = () => {
    toast(t("toasts.withdrawSuccessToast"));
    refetch();
    refetchTotalAssets();
    refetchLimits();
    setSelectedPosition(null);
    refetchVaults();
  };
  const onWithdrawError = (e: string) => {
    toast(t("toasts.withdrawErrorToast") + ": " + e);
  };

  const {
    isPending: isPendingWithdrawYield,
    txState: withdrawYieldTxState,
    withdrawYield,
  } = useWithdrawYield(vaults, {
    onWithdrawYieldError: e => {
      toast(t("toasts.yieldWithdrawError", { error: e }));
    },
    onWithdrawYieldSuccess: () => {
      toast(t("toasts.yieldWithdrawn"));
      refetch();
      refetchTotalAssets();
    },
  });

  const confirmingInWalletWithdrawYield = Object.values(withdrawYieldTxState).some(
    s => s.phase === "awaiting-signature"
  );

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {(
          [
            {
              header: t("totalSupplied"),
              icon: <DollarSign aria-hidden={true} />,
              iconBgClassName: "bg-primary/20",
              info:
                totalSupplied && selectedAsset
                  ? formatAsset(
                      totalSupplied,
                      selectedAsset.decimals,
                      selectedAsset.symbol
                    ).text
                  : "--",
            },
            {
              header: t("averageAPY"),
              icon: <TrendingUp aria-hidden={true} className="text-blue-500" />,
              iconBgClassName: "bg-blue-100",
              info:
                vaults.length > 0
                  ? formatAprToPercent(
                      calcAprByInterestEarned(totalAccrued, totalSupplied)
                    ).text
                  : "--",
            },
            {
              header: t("interestEarned"),
              icon: <Percent aria-hidden={true} className="text-purple-500" />,
              iconBgClassName: "bg-purple-100",
              info:
                totalAccrued !== undefined && selectedAsset
                  ? `${formatUnits(totalAccrued, selectedAsset.decimals).text} ${selectedAsset.symbol}`
                  : "--",
            },
          ] satisfies InfoCardProps[]
        ).map(i => (
          <InfoCard
            header={i.header}
            icon={i.icon}
            iconBgClassName={i.iconBgClassName}
            info={i.info}
            key={i.header}
          />
        ))}
      </div>
      <AssetsList
        className="w-1/2"
        direction={dir}
        isLoading={isLoadingVaults}
        onSelectAsset={setSelectedAsset}
        options={vaultsAssetsList}
        selectedAsset={selectedAsset}
        skeletonsToShow={1}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {isLoadingPositions || isPendingVaults ? (
          showSkeletons(3, "h-40 sm:h-50")
        ) : positions.length > 0 ? (
          positions.map(position => {
            const rewardsClaimable = position.vault.strategies.some(
              s => compareDatish(s.endDate, Date.now()) <= 0
            );

            const button = (
              <Button
                className="flex-1"
                disabled={
                  isPendingWithdrawYield ||
                  position.accruedYield === 0n ||
                  !rewardsClaimable
                }
                onClick={() =>
                  withdrawYield({
                    strategyIds: position.vault.strategies.map(s => s.id),
                    vaultAddress: position.vault.address,
                  })
                }
              >
                {confirmingInWalletWithdrawYield
                  ? t("confirming")
                  : isPendingWithdrawYield
                    ? t("withdrawing")
                    : t("claimRewards")}
              </Button>
            );

            return (
              <PositionCard
                claimRewardsButton={
                  rewardsClaimable ? (
                    button
                  ) : (
                    <Tooltip
                      className="max-w-75 text-center"
                      content={t("rewardsAvailableTooltip")}
                    >
                      {button}
                    </Tooltip>
                  )
                }
                key={position.vault.address}
                position={position}
                withdrawButton={
                  <Button
                    className="flex-1"
                    disabled={position.balance === 0n}
                    onClick={() => setSelectedPosition(position)}
                  >
                    {t("withdraw")}
                  </Button>
                }
              />
            );
          })
        ) : (
          <div className="sm:col-span-3">
            <Heading className="pt-2 font-semibold" level="5">
              {t("noPositions.title")}
            </Heading>
            <p className="">{t("noPositions.description")}</p>
          </div>
        )}
      </div>
      {selectedPosition && selectedAsset && (
        <WithdrawModal
          onOpenChange={open => {
            if (!open) {
              setSelectedPosition(null);
            }
          }}
          onWithdrawError={onWithdrawError}
          onWithdrawSuccess={onWithdrawSuccess}
          open={Boolean(selectedPosition)}
          selectedAsset={selectedAsset}
          selectedPosition={selectedPosition}
          title={t("withdrawModal.title")}
        />
      )}
    </div>
  );
}
