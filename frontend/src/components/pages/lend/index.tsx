"use client";

import { useVaults } from "../../../lib/core/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { Button, Card, Heading } from "@diffuse/ui-kit";
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
  const { vaults, isPending, vaultsAssetsList } = useVaults();
  const previousVaulsCount = usePreviousVaulsCount(vaults.length);
  const { selectedVaults, setAmountForVault } = useSelectedVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const { dict, lang, dir } = useLocalization();
  const router = useRouter();
  const onSuccessAllowance = useCallback(() => {
    toast(dict.lend.toasts.approveSuccessToast);
  }, [dict.lend.toasts.approveSuccessToast]);
  const { allAllowed, approveMissing, ableToRequest, refetchAllowances } =
    useEnsureAllowances(selectedVaults, { onSuccess: onSuccessAllowance });
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

  const { reset, deposit } = useDeposit(selectedVaults, vaults, {
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
        text: dict.lend.depositButtonText,
        disabled: false,
        onClick: () => deposit(),
        className: "bg-orange-500 hover:bg-orange-600 text-white",
      };
    }

    if (ableToRequest) {
      return {
        text: dict.lend.approveButtonText,
        disabled: false,
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
            isLoading={isPending}
            options={vaultsAssetsList}
            direction={dir}
          />
        </Card>
        {isPending ? (
          showSkeletons(previousVaulsCount || 2, "h-50")
        ) : (
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
