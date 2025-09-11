"use client";

import { useVaults } from "../../../lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { Button, Card, Heading } from "@diffuse/ui-kit";
import { VaultCard } from "./VaultCard";
import { AssetsList } from "./AssetsList";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { useCallback, useEffect } from "react";
import { useSelectedVaults } from "@/lib/core/hooks/useSelectVaults";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { showSkeletons } from "@/lib/misc/showSkeletons";
import { parseUnits } from "viem";
import { useRouter } from "next/navigation";
import { localizePath } from "@/lib/localization/locale";
import { useDeposit } from "@/lib/core/hooks/useDeposit";
import { toast } from "@/lib/toast";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";

export default function LendPage() {
  const { vaults, isLoading, vaultsAssetsList, isRefetching, isPending } = useVaults();
  const previousVaultsCount = usePreviousVaulsCount(vaults.length);
  const { selectedVaults, setAmountForVault } = useSelectedVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const { dict, lang, dir } = useLocalization();
  const router = useRouter();
  const onSuccessAllowance = useCallback(() => {
    toast(dict.lend.toasts.approveSuccessToast);
  }, [dict.lend.toasts.approveSuccessToast]);
  const {
    allAllowed,
    approveMissing,
    ableToRequest,
    refetchAllowances,
    isPendingApprovals,
  } = useEnsureAllowances(selectedVaults, { onSuccess: onSuccessAllowance });
  const onDepositSuccessFn = () => {
    router.push(localizePath("/lend/my-positions", lang));
  };
  const resetForms = () => {
    selectedVaults.forEach(v => {
      const vault = vaults.find(va => va.address === v.address);
      if (vault) {
        setAmountForVault(vault, 0n);
      }
    });
  };

  const { reset, deposit, isPendingBatch, txState } = useDeposit(selectedVaults, vaults, {
    onDepositBatchAllSuccess: () => {
      onDepositSuccessFn();
      toast(dict.lend.toasts.depositSuccessToast);
      setTimeout(() => {
        resetForms();
        reset();
      }, 0);
    },
    onDepositBatchSomeError: () => {
      toast(dict.lend.toasts.depositErrorToast);
    },
    onDepositBatchComplete: () => {
      refetchAllowances();
    },
  });

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;

  const actionButtonMeta = (() => {
    if (allAllowed) {
      return {
        text: isPendingBatch ? dict.lend.depositing : dict.lend.depositButtonText,
        disabled: isPendingBatch,
        onClick: () => deposit(),
        className: "bg-orange-500 hover:bg-orange-600 text-white",
      };
    }

    if (ableToRequest) {
      return {
        text: isPendingApprovals ? dict.lend.approving : dict.lend.approveButtonText,
        disabled: isPendingApprovals,
        onClick: () => approveMissing({ mode: "exact" }),
        className: "bg-blue-500 hover:bg-blue-600 text-white",
      };
    }

    return {
      text: dict.lend.enterAmountButtonText,
      disabled: true,
      onClick: undefined,
      className: "",
    };
  })();

  const stepText = !allAllowed ? "1/2" : "2/2";

  return (
    <div className="mt-9 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-9">
      <div className="col-span-1 row-start-1 flex flex-col gap-3">
        <Heading level="5">{dict.lend.assetsToLend}</Heading>
        <AssetsList
          onSelectAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
          isLoading={isLoading || isRefetching}
          options={vaultsAssetsList}
          direction={dir}
        />
      </div>
      <div className="col-span-1 row-start-2 flex flex-col gap-6 sm:col-span-1">
        {isLoading || isRefetching ? (
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
                    const value = parseUnits(evt.value, selectedAsset!.decimals);
                    setAmountForVault(vault, value);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="pt-2 font-semibold">{dict.lend.noVaults.title}</p>
            <p className="">{dict.lend.noVaults.description}</p>
          </>
        )}
      </div>
      <div className="col-span-1 row-start-2 flex flex-col gap-4 sm:col-span-1">
        <Card
          header={
            selectedAsset?.symbol && !isPending
              ? `Diffuse Prime ${selectedAsset?.symbol} vault`
              : undefined
          }
        >
          <Button
            onClick={actionButtonMeta.onClick}
            disabled={actionButtonMeta.disabled}
            className={actionButtonMeta.className}
          >
            {actionButtonMeta.text}
          </Button>
          <p className="my-4 text-center font-mono text-xs">{`Step ${stepText}`}</p>
          <Heading level="3" className="mb-2">
            Deposit logs (temporary mock before design finalization)
          </Heading>
          {txState && Object.keys(txState).length === 0 && (
            <p>No deposit transactions yet</p>
          )}
          <ul className="flex flex-col gap-2">
            {Object.entries(txState).map(([addr, info]) => (
              <li key={addr} className="border-primary rounded-sm border p-2">
                <p>
                  Vault: <span className="font-mono">{addr}</span>
                </p>
                {info.phase && (
                  <p>
                    Phase: <span className="font-mono">{info.phase}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function usePreviousVaulsCount(vaultsLenght: number) {
  const [count, setCount] = useLocalStorage("lend-prev-vaults-count", 0);

  useEffect(() => {
    if (vaultsLenght !== count) {
      setCount(vaultsLenght);
    }
  }, [vaultsLenght, count, setCount]);

  return count;
}
