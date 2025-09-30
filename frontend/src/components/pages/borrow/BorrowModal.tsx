"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AssetInfo } from "@/lib/assets/validations";
import { AssetInput, Button, Card, Dialog, Heading, Slider } from "@diffuse/ui-kit";
import { VaultFullInfo } from "@/lib/core/types";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { useERC20TokenBalance } from "@/lib/wagmi/useERC20TokenBalance";
import { formatUnits } from "@/lib/formatters/asset";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { parseUnits } from "viem";
import { useBorrow } from "@/lib/core/hooks/useBorrow";
import { toast } from "@/lib/toast";

type ChainSwitchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  selectedAsset: AssetInfo;
  selectedVault: VaultFullInfo;
};

export function BorrowModal({
  open,
  onOpenChange,
  selectedAsset,
  selectedVault,
}: ChainSwitchModalProps) {
  const t = useTranslations("borrow.borrowModal");
  const title = t("title", { assetSymbol: selectedAsset.symbol });
  const [amount, setAmount] = React.useState<bigint>();
  const BorrowInput = {
    address: selectedVault?.address,
    assetAddress: selectedAsset.address,
    assetSymbol: selectedAsset.symbol,
    assetDecimals: selectedAsset.decimals,
    amount: BigInt(0),
    legacyAllowance: false,
    chainId: selectedVault?.contract.chainId,
  };
  const { allAllowed, isPendingApprovals, approveMissing, ableToRequest } =
    useEnsureAllowances([BorrowInput]);
  const { balance } = useERC20TokenBalance({ token: selectedAsset?.address });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-expect-error */
  const {} = useBorrow({}, selectedVault, {
    onBorrowSuccess: () => toast("Borrow request made successfully"),
  });
  const totalAmountToDeposit = BigInt(amount || "0");
  const isAmountExceedsBalance =
    selectedAsset !== undefined &&
    balance !== undefined &&
    totalAmountToDeposit > balance;

  const actionButtonMeta = (() => {
    if (amount === undefined || amount === BigInt(0)) {
      return {
        text: "Enter amount",
        disabled: true,
        onClick: undefined,
      };
    }

    if (isAmountExceedsBalance) {
      return {
        text: "insufficientBalance",
        disabled: true,
        onClick: undefined,
      };
    }

    // if (allAllowed) {
    //   return {
    //     text: isPendingBatch ? "Depositing" : "Deposit",
    //     disabled: isPendingBatch,
    //     onClick: () => deposit(),
    //   };
    // }

    if (ableToRequest) {
      return {
        text: isPendingApprovals ? "Approving" : "Approve",
        disabled: isPendingApprovals,
        onClick: () => approveMissing({ mode: "exact" }),
      };
    }

    return {
      text: "Enter amount",
      disabled: true,
      onClick: undefined,
    };
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} size="lg">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Heading level="5">Collateral</Heading>
          <AssetInput
            placeholder="0.0"
            value={amount ? formatUnits(amount, selectedAsset.decimals).text : ""}
            onValueChange={evt => {
              const value = parseUnits(evt.value, selectedAsset.decimals);
              setAmount(value);
            }}
            assetSymbol={selectedAsset?.symbol}
            renderAssetImage={() => (
              <AssetImage alt="" address={selectedAsset.address} size={24} />
            )}
          />
          <Card>
            <Heading level="5">Leverage</Heading>
            <Slider />
            <AssetInput
              placeholder="0.0"
              value={amount ? formatUnits(amount, selectedAsset.decimals).text : ""}
              onValueChange={evt => {
                const value = parseUnits(evt.value, selectedAsset.decimals);
                setAmount(value);
              }}
              assetSymbol={selectedAsset?.symbol}
              renderAssetImage={() => (
                <AssetImage alt="" address={selectedAsset.address} size={24} />
              )}
            />
          </Card>
          <Button
            onClick={actionButtonMeta.onClick}
            disabled={actionButtonMeta.disabled}
            size="lg"
            className="mt-6 lg:w-2/3"
          >
            {actionButtonMeta.text}
          </Button>
        </div>
        <div>
          <Heading level="5">Position details</Heading>
        </div>
      </div>
    </Dialog>
  );
}
