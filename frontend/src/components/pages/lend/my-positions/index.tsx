"use client";

import { useVaults } from "@/lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { DollarSign, Percent, TrendingUp } from "lucide-react";
import { AssetsList } from "../../../AssetsList";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { Button, Heading, Tooltip } from "@diffuse/ui-kit";
import { useLenderPositions } from "@/lib/core/hooks/useLenderPositions";
import { toast } from "@/lib/toast";
import { InfoCard, InfoCardProps } from "./InfoCard";
import { PositionCard } from "./PositionCard";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { useTranslations } from "next-intl";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprByInterestEarned } from "@/lib/formulas/apr";
import { showSkeletons } from "@/lib/misc/ui";
import { useWithdraw } from "@/lib/core/hooks/useWithdraw";
import { useWithdrawYield } from "@/lib/core/hooks/useWithdrawYield";
import { compareDatish } from "@/lib/formatters/date";

export default function MyPositions() {
  const {
    vaults,
    vaultsAssetsList,
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
    refetchTotalAssets,
    vaultLimits,
  } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const { dir } = useLocalization();
  const t = useTranslations("myPositions");

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const {
    positions,
    isLoading: isLoadingPositions,
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
  };
  const onWithdrawError = () => {
    toast(t("toasts.withdrawErrorToast"));
  };
  const { withdraw, isPendingSingle, txState } = useWithdraw(vaults, vaultLimits, {
    onWithdrawSuccess,
    onWithdrawError,
  });

  const {
    withdrawYield,
    isPending: isPendingWithdrawYield,
    txState: withdrawYieldTxState,
  } = useWithdrawYield(vaults, {
    onWithdrawYieldSuccess: () => {
      toast("Yield withdrawn successfully");
      refetch();
      refetchTotalAssets();
    },
    onWithdrawYieldError: () => {
      toast("Error withdrawing yield");
    },
  });

  const confirmingInWalletWithdraw = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

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
              icon: <TrendingUp className="text-blue-500" aria-hidden={true} />,
              info: vaults.length
                ? formatAprToPercent(calcAprByInterestEarned(totalAccrued, totalSupplied))
                    .text
                : "--",
              iconBgClassName: "bg-blue-100",
            },
            {
              header: t("interestEarned"),
              icon: <Percent className="text-purple-500" aria-hidden={true} />,
              info:
                totalAccrued !== undefined && selectedAsset
                  ? `${formatUnits(totalAccrued, selectedAsset.decimals).text} ${selectedAsset.symbol}`
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
                onClick={() =>
                  withdrawYield({
                    vaultAddress: position.vault.address,
                    strategyIds: position.vault.strategies.map(s => s.id),
                  })
                }
                disabled={
                  isPendingWithdrawYield ||
                  position.accruedYield === 0n ||
                  !rewardsClaimable
                }
              >
                {confirmingInWalletWithdrawYield
                  ? "Confirming..."
                  : isPendingWithdrawYield
                    ? "Withdrawing..."
                    : "Claim rewards"}
              </Button>
            );

            return (
              <PositionCard
                position={position}
                key={position.vault.address}
                withdrawButton={
                  <Button
                    className="flex-1"
                    onClick={() =>
                      withdraw({
                        vaultAddress: position.vault.address,
                        amount: position.balance,
                      })
                    }
                    disabled={isPendingSingle || position.balance === 0n}
                  >
                    {confirmingInWalletWithdraw
                      ? "Confirming..."
                      : isPendingSingle
                        ? t("withdrawing")
                        : t("withdraw")}
                  </Button>
                }
                claimRewardsButton={
                  !rewardsClaimable ? (
                    <Tooltip
                      className="max-w-75 text-center"
                      content="Rewards will be available when at least one strategy ends."
                    >
                      {button}
                    </Tooltip>
                  ) : (
                    button
                  )
                }
              />
            );
          })
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
