import { AssetImage } from "@/components/misc/images/AssetImage";
import { AssetInfo } from "@/lib/assets/validations";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { useWithdraw } from "@/lib/core/hooks/useWithdraw";
import { LenderPosition } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatNumberToKMB } from "@/lib/formatters/number";
import {
  AssetInput,
  Button,
  Dialog,
  Heading,
  Tooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ArrowRight } from "lucide-react";
import { ReactNode, useState } from "react";
import { getAddress, parseUnits } from "viem";

type WithdrawModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  selectedAsset: AssetInfo;
  selectedPosition: LenderPosition;
  onWithdrawSuccess: () => void;
  onWithdrawError: (e: string) => void;
};

export function WithdrawModal({
  onWithdrawError,
  onWithdrawSuccess,
  selectedPosition,
  selectedAsset,
  open,
  onOpenChange,
  title,
}: WithdrawModalProps) {
  const [amountToWithdraw, setAmountToWithdraw] = useState<bigint>(0n);
  const { vaults, vaultLimits } = useVaults();
  const maxWithdrawable =
    vaultLimits.find(
      v => getAddress(v.address) === getAddress(selectedPosition.vault.address)
    )?.maxWithdraw ?? 0n;
  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const {
    withdraw,
    isPending,
    txState,
    reset: resetWithdrawState,
  } = useWithdraw(vaultsForSelectedAsset, vaultLimits, {
    onWithdrawSuccess,
    onWithdrawError,
  });

  const confirmingInWalletWithdraw = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );
  const balanceFormatted = formatAsset(
    selectedPosition.balance,
    selectedAsset.decimals,
    selectedAsset.symbol
  );

  const suppliedDisplay =
    amountToWithdraw === 0n ? (
      balanceFormatted.text
    ) : selectedPosition.balance >= amountToWithdraw ? (
      <div className="flex items-center gap-2 leading-none">
        {balanceFormatted.text}
        <ArrowRight size={14} />
        {
          formatAsset(
            selectedPosition.balance - amountToWithdraw,
            selectedAsset.decimals,
            selectedAsset.symbol
          ).text
        }
      </div>
    ) : (
      "N/A"
    );

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        resetWithdrawState();
      }}
      title={title}
      size="md"
    >
      <div className="flex flex-col gap-4 px-6">
        <Heading level="5">Withdraw</Heading>
        <div className="flex flex-col gap-2">
          <AssetInput
            placeholder="0.0"
            value={
              amountToWithdraw
                ? formatUnits(amountToWithdraw, selectedAsset?.decimals).text
                : ""
            }
            onValueChange={evt => {
              const value = parseUnits(evt.value, selectedAsset.decimals);
              setAmountToWithdraw(value);
            }}
            assetSymbol={selectedAsset?.symbol}
            renderAssetImage={() => (
              <AssetImage alt="" address={selectedAsset.address} size={24} />
            )}
          />
          <div className="text-muted flex flex-nowrap items-center gap-2 pl-2 font-mono text-xs">
            {`Available for Withdraw ${selectedAsset.symbol}: `}
            <Tooltip content="Withdraw all" side="top">
              <Button
                size="sm"
                variant="link"
                className="text-xs"
                onClick={() => setAmountToWithdraw(maxWithdrawable)}
              >
                {
                  formatNumberToKMB(
                    Number(
                      formatUnits(maxWithdrawable, selectedAsset.decimals).meta!.rawViem
                    )
                  ).text
                }
              </Button>
            </Tooltip>
          </div>
        </div>
        <UncontrolledCollapsible
          defaultOpen
          summary={<span className="text-text-dimmed font-mono text-sm">Position</span>}
        >
          <div className="border-primary flex flex-col gap-2 border-l px-2 py-1">
            <div className="flex items-center justify-between text-sm">
              <span>Supplied</span>
              {suppliedDisplay}
            </div>
          </div>
        </UncontrolledCollapsible>
        <Button
          className="mx-auto mt-12 w-2/3"
          onClick={() => {
            withdraw({
              vaultAddress: selectedPosition.vault.address,
              amount: amountToWithdraw,
            });
          }}
          disabled={
            isPending ||
            amountToWithdraw === 0n ||
            amountToWithdraw > selectedPosition.balance
          }
          size="lg"
        >
          {confirmingInWalletWithdraw
            ? "Confirming in wallet..."
            : isPending
              ? "Withdrawing..."
              : "Withdraw"}
        </Button>
      </div>
    </Dialog>
  );
}
