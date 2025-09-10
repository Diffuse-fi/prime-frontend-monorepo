"use client";

import { useVaults } from "../../../lib/core/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { Button, Card, Heading, Text } from "@diffuse/ui-kit";
import { VaultCard } from "./VaultCard";
import { AssetsList } from "./AssetsList";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { useCallback, useEffect } from "react";
import { useSelectedVaults } from "@/lib/core/useSelectVaults";
import { useEnsureAllowances } from "@/lib/core/useEnsureAllowances";
import { showSkeletons } from "@/lib/misc/showSkeletons";
import { parseUnits } from "viem";
import { useRouter } from "next/navigation";
import { localizePath } from "@/lib/localization/locale";
import { useDeposit } from "@/lib/core/useDeposit";
import { toast } from "@/lib/toast";
import { useSelectedAsset } from "@/lib/core/useSelectedAsset";

export default function LendPage() {
  const { vaults, isLoading, vaultsAssetsList, isRefetching } = useVaults();
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

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-9 sm:gap-4">
      <div className="col-span-1 flex flex-col gap-4 sm:col-span-4">
        <Card title={dict.lend.assetsToLend}>
          <Heading level={2}>{dict.lend.assetsToLend}</Heading>
          <AssetsList
            onSelectAsset={setSelectedAsset}
            selectedAsset={selectedAsset}
            isLoading={isLoading || isRefetching}
            options={vaultsAssetsList}
            direction={dir}
          />
        </Card>
        {isLoading || isRefetching ? (
          showSkeletons(previousVaultsCount || 2, "h-50")
        ) : vaultsForSelectedAsset.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {vaultsForSelectedAsset.map(vault => (
              <li key={vault.address} className="animate-in-fade">
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
            <Text className="pt-2 font-semibold">{dict.lend.noVaults.title}</Text>
            <Text className="">{dict.lend.noVaults.description}</Text>
          </>
        )}
      </div>
      <div className="col-span-1 flex flex-col gap-4 sm:col-span-5">
        <Card>
          <Button
            onClick={actionButtonMeta.onClick}
            disabled={actionButtonMeta.disabled}
            className={actionButtonMeta.className}
          >
            {actionButtonMeta.text}
          </Button>
          <div>
            <Heading level={3} className="mt-4 mb-2">
              Deposit logs (temporary mock before design finalization)
            </Heading>
            {txState && Object.keys(txState).length === 0 && (
              <Text>No deposit transactions yet</Text>
            )}
            <ul className="flex flex-col gap-2">
              {Object.entries(txState).map(([addr, info]) => (
                <li key={addr} className="border-primary rounded-sm border p-2">
                  <Text>
                    Vault: <span className="font-mono">{addr}</span>
                  </Text>
                  {info.phase && (
                    <Text>
                      Phase: <span className="font-mono">{info.phase}</span>
                    </Text>
                  )}
                </li>
              ))}
            </ul>
          </div>
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
