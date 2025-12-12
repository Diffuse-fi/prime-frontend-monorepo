"use client";

import { Button, Card, Heading, SimpleTable, Tooltip } from "@diffuse/ui-kit";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { parseUnits } from "viem";
import { useAccount, useAccountEffect } from "wagmi";

import { env } from "@/env";
import { useDeposit } from "@/lib/core/hooks/useDeposit";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useSelectedVaults } from "@/lib/core/hooks/useSelectVaults";
import { formatUnits, getPartialAllowanceText } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { useRouter } from "@/lib/localization/navigation";
import { useLocalization } from "@/lib/localization/useLocalization";
import { showSkeletons } from "@/lib/misc/ui";
import { usePrevValueLocalStorage } from "@/lib/misc/usePrevValueLocalStorage";
import { toast } from "@/lib/toast";
import { useOnChainSwitch } from "@/lib/wagmi/onChainSwitch";

import { useVaults } from "../../../lib/core/hooks/useVaults";
import { useERC20TokenBalance } from "../../../lib/wagmi/useErc20TokenBalance";
import { AssetsList } from "../../AssetsList";
import { VaultCard } from "./VaultCard";

export default function Lend() {
  const {
    isLoading,
    isPending,
    refetchLimits,
    refetchTotalAssets,
    vaultLimits,
    vaults,
    vaultsAssetsList,
  } = useVaults();
  const previousVaultsCount = usePrevValueLocalStorage(
    vaults.length,
    0,
    "lend-vaults-count"
  );
  const {
    reset: resetSelectedVaults,
    selectedVaults,
    setAmountForVault,
  } = useSelectedVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const { dir } = useLocalization();
  const t = useTranslations("lend");
  const router = useRouter();
  const onSuccessAllowance = useCallback(() => {
    toast(t("toasts.approveSuccessToast"));
  }, [t]);
  const {
    ableToRequest,
    allAllowed,
    allowances,
    approveMissing,
    isPendingApprovals,
    refetchAllowances,
  } = useEnsureAllowances(selectedVaults, { onSuccess: onSuccessAllowance });
  const resetForms = () => {
    for (const v of selectedVaults) {
      const vault = vaults.find(va => va.address === v.address);
      if (vault) {
        setAmountForVault(vault, 0n);
      }
    }
  };
  const { isConnected } = useAccount();

  const { deposit, reset, txState } = useDeposit(selectedVaults, vaults, vaultLimits, {
    onDepositBatchAllSuccess: () => {
      router.push("/lend/my-positions");
      toast(t("toasts.depositSuccessToast"));
      setTimeout(() => {
        resetForms();
        reset();
        refetchTotalAssets();
        refetchLimits();
        refetchAllowances();
      }, 0);
    },
    onDepositBatchComplete: () => {
      refetchAllowances();
    },
    onDepositBatchSomeError: e => {
      toast(
        `Error depositing to some vaults: ${Object.values(e)
          .map(err => err.message)
          .join(", ")}`
      );
    },
  });

  const isPendingBatch = Object.values(txState).some(s => s.phase === "pending");
  const confirmingInWallet = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;

  const { balance } = useERC20TokenBalance({ token: selectedAsset?.address });
  const totalAmountToDeposit = selectedVaults.reduce((acc, v) => acc + v.amount, 0n);
  const isAmountExceedsBalance =
    selectedAsset !== undefined &&
    balance !== undefined &&
    totalAmountToDeposit > balance;

  const currentlyAllowed = allowances
    ? allowances.reduce(
        (acc, a) => {
          const vaultAllowance = a.current;

          if (vaultAllowance !== null) {
            return (acc ?? 0n) + vaultAllowance;
          }

          return acc;
        },
        undefined as bigint | undefined
      )
    : undefined;

  const actionButtonMeta = (() => {
    if (isAmountExceedsBalance) {
      return {
        disabled: true,
        onClick: undefined,
        text: t("insufficientFundsButtonText"),
      };
    }

    if (allAllowed) {
      if (confirmingInWallet) {
        return {
          disabled: true,
          onClick: undefined,
          text: t("confirming"),
        };
      }

      return {
        disabled: isPendingBatch,
        onClick: () => deposit(),
        text: isPendingBatch ? t("depositing") : t("depositButtonText"),
      };
    }

    if (ableToRequest) {
      return {
        disabled: isPendingApprovals,
        onClick: () => approveMissing({ mode: "exact" }),
        text: isPendingApprovals ? (
          t("approving")
        ) : (
          <div className="flex items-center gap-1">
            <div className="leading-none">{t("approveButtonText")}</div>
            {currentlyAllowed !== null &&
            currentlyAllowed !== undefined &&
            !!selectedAsset ? (
              <Tooltip
                content={getPartialAllowanceText(
                  currentlyAllowed,
                  totalAmountToDeposit,
                  selectedAsset.decimals,
                  selectedAsset.symbol
                )}
                side="top"
              >
                <InfoIcon size={14} />
              </Tooltip>
            ) : null}
          </div>
        ),
      };
    }

    return {
      disabled: true,
      onClick: undefined,
      text: t("enterAmountButtonText"),
    };
  })();

  const stepText = allAllowed ? "2/2" : "1/2";

  useOnChainSwitch(resetSelectedVaults);
  useAccountEffect({
    onDisconnect: resetSelectedVaults,
  });

  return (
    <div className="mt-9 grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-9">
      <div className="row-start-1 flex flex-col gap-3">
        <Heading level="5">{t("assetsToLend")}</Heading>
        <AssetsList
          className="w-fit"
          direction={dir}
          isLoading={isLoading}
          onSelectAsset={setSelectedAsset}
          options={vaultsAssetsList}
          selectedAsset={selectedAsset}
        />
      </div>
      <div className="col-span-1 flex flex-col gap-6 md:row-start-2">
        {isLoading ? (
          showSkeletons(previousVaultsCount || 2, "h-50")
        ) : vaultsForSelectedAsset.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {vaultsForSelectedAsset.map(vault => (
              <li key={vault.address}>
                <VaultCard
                  amount={selectedVaults.find(v => v.address === vault.address)?.amount}
                  isConnected={isConnected}
                  onAmountChange={evt => {
                    if (!selectedAsset) return;

                    const value = parseUnits(evt.value, selectedAsset.decimals);
                    setAmountForVault(vault, value);
                  }}
                  selectedAsset={selectedAsset!}
                  vault={vault}
                />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="pt-2 font-semibold">{t("noVaults.title")}</p>
            <p className="">{t("noVaults.description")}</p>
          </>
        )}
      </div>
      {isConnected && (
        <div className="col-span-1 row-start-2 flex flex-col gap-4 sm:col-span-1">
          <Card
            cardBodyClassName="items-center gap-4"
            header={
              selectedAsset?.symbol && !isPending
                ? `${env.NEXT_PUBLIC_APP_NAME} ${selectedAsset?.symbol} ${t("vault")}`
                : undefined
            }
          >
            <SimpleTable
              aria-label={t("ariaLabels.selectedAssets")}
              className={selectedVaults.length === 0 ? "mb-10" : undefined}
              columns={[
                <div className="text-left font-mono text-xs" key="key1">
                  Asset
                </div>,
                <div className="text-right font-mono text-xs" key="key2">
                  Sum to lend
                </div>,
                <div className="text-right font-mono text-xs" key="key3">
                  Target APY
                </div>,
              ]}
              density="comfy"
              rows={selectedVaults.map(v => {
                const vault = vaults.find(va => va.address === v.address);
                const amount = v.amount;
                const decimals = v.assetDecimals;

                return [
                  <div className="flex items-center" key="1">
                    {vault ? vault.name : v.address}
                  </div>,
                  <div className="text-right" key="2">
                    {formatUnits(amount, decimals).text}
                  </div>,
                  <div className="text-right" key="3">
                    {vault ? formatAprToPercent(vault.targetApr).text : "-"}
                  </div>,
                ].flat();
              })}
            />
            <Button
              className="lg:w-1/2"
              disabled={actionButtonMeta.disabled}
              onClick={actionButtonMeta.onClick}
              size="lg"
            >
              {actionButtonMeta.text}
            </Button>
            <p className="font-mono text-xs">{`Step ${stepText}`}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
