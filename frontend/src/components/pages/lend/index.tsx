"use client";

import { useVaults } from "../../../lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { Button, Card, Heading, SimpleTable, Tooltip } from "@diffuse/ui-kit";
import { VaultCard } from "./VaultCard";
import { AssetsList } from "../../AssetsList";
import { useCallback } from "react";
import { useSelectedVaults } from "@/lib/core/hooks/useSelectVaults";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { parseUnits } from "viem";
import { useDeposit } from "@/lib/core/hooks/useDeposit";
import { toast } from "@/lib/toast";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { formatUnits, getPartialAllowanceText } from "@/lib/formatters/asset";
import { usePrevValueLocalStorage } from "@/lib/misc/usePrevValueLocalStorage";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/localization/navigation";
import { env } from "@/env";
import { showSkeletons } from "@/lib/misc/ui";
import { useAccount, useAccountEffect } from "wagmi";
import { useERC20TokenBalance } from "@/lib/wagmi/useERC20TokenBalance";
import { useOnChainSwitch } from "@/lib/wagmi/onChainSwitch";
import { InfoIcon } from "lucide-react";

export default function Lend() {
  const {
    vaults,
    isLoading,
    vaultsAssetsList,
    isPending,
    refetchTotalAssets,
    refetchLimits,
    vaultLimits,
  } = useVaults();
  const previousVaultsCount = usePrevValueLocalStorage(
    vaults.length,
    0,
    "lend-vaults-count"
  );
  const {
    selectedVaults,
    setAmountForVault,
    reset: resetSelectedVaults,
  } = useSelectedVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const { dir } = useLocalization();
  const t = useTranslations("lend");
  const router = useRouter();
  const onSuccessAllowance = useCallback(() => {
    toast(t("toasts.approveSuccessToast"));
  }, [t]);
  const {
    allAllowed,
    allowances,
    approveMissing,
    ableToRequest,
    refetchAllowances,
    isPendingApprovals,
  } = useEnsureAllowances(selectedVaults, { onSuccess: onSuccessAllowance });
  const resetForms = () => {
    selectedVaults.forEach(v => {
      const vault = vaults.find(va => va.address === v.address);
      if (vault) {
        setAmountForVault(vault, 0n);
      }
    });
  };
  const { isConnected } = useAccount();

  const { reset, deposit, txState } = useDeposit(selectedVaults, vaults, vaultLimits, {
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
    onDepositBatchSomeError: e => {
      toast(
        `Error depositing to some vaults: ${Object.values(e)
          .map(err => err.message)
          .join(", ")}`
      );
    },
    onDepositBatchComplete: () => {
      refetchAllowances();
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
        text: t("insufficientFundsButtonText"),
        disabled: true,
        onClick: undefined,
      };
    }

    if (allAllowed) {
      if (confirmingInWallet) {
        return {
          text: t("confirming"),
          disabled: true,
          onClick: undefined,
        };
      }

      return {
        text: isPendingBatch ? t("depositing") : t("depositButtonText"),
        disabled: isPendingBatch,
        onClick: () => deposit(),
      };
    }

    if (ableToRequest) {
      return {
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
        disabled: isPendingApprovals,
        onClick: () => approveMissing({ mode: "exact" }),
      };
    }

    return {
      text: t("enterAmountButtonText"),
      disabled: true,
      onClick: undefined,
    };
  })();

  const stepText = !allAllowed ? "1/2" : "2/2";

  useOnChainSwitch(resetSelectedVaults);
  useAccountEffect({
    onDisconnect: resetSelectedVaults,
  });

  return (
    <div className="mt-9 grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-9">
      <div className="row-start-1 flex flex-col gap-3">
        <Heading level="5">{t("assetsToLend")}</Heading>
        <AssetsList
          onSelectAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
          isLoading={isLoading}
          options={vaultsAssetsList}
          direction={dir}
          className="w-fit"
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
                  selectedAsset={selectedAsset!}
                  vault={vault}
                  amount={selectedVaults.find(v => v.address === vault.address)?.amount}
                  onAmountChange={evt => {
                    if (!selectedAsset) return;

                    const value = parseUnits(evt.value, selectedAsset.decimals);
                    setAmountForVault(vault, value);
                  }}
                  isConnected={isConnected}
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
            header={
              selectedAsset?.symbol && !isPending
                ? `${env.NEXT_PUBLIC_APP_NAME} ${selectedAsset?.symbol} ${t("vault")}`
                : undefined
            }
            cardBodyClassName="items-center gap-4"
          >
            <SimpleTable
              aria-label={t("ariaLabels.selectedAssets")}
              density="comfy"
              className={selectedVaults.length === 0 ? "mb-10" : undefined}
              columns={[
                <div key="key1" className="text-left font-mono text-xs">
                  Asset
                </div>,
                <div key="key2" className="text-right font-mono text-xs">
                  Sum to lend
                </div>,
                <div key="key3" className="text-right font-mono text-xs">
                  Target APY
                </div>,
              ]}
              rows={selectedVaults.map(v => {
                const vault = vaults.find(va => va.address === v.address);
                const amount = v.amount;
                const decimals = v.assetDecimals;

                return [
                  <div key="1" className="flex items-center">
                    {vault ? vault.name : v.address}
                  </div>,
                  <div key="2" className="text-right">
                    {formatUnits(amount, decimals).text}
                  </div>,
                  <div key="3" className="text-right">
                    {vault ? formatAprToPercent(vault.targetApr).text : "-"}
                  </div>,
                ].flat();
              })}
            />
            <Button
              onClick={actionButtonMeta.onClick}
              disabled={actionButtonMeta.disabled}
              size="lg"
              className="lg:w-1/2"
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
