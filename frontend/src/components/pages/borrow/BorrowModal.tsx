"use client";

import { useTranslations } from "next-intl";
import { AssetInfo } from "@/lib/assets/validations";
import { AssetInput, Button, Card, Dialog, Heading, Slider } from "@diffuse/ui-kit";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { useERC20TokenBalance } from "@/lib/wagmi/useERC20TokenBalance";
import { formatUnits } from "@/lib/formatters/asset";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { parseUnits } from "viem";
import { useBorrow } from "@/lib/core/hooks/useBorrow";
import { toast } from "@/lib/toast";
import { SelectedStartegy } from ".";
import { ReactNode, useReducer } from "react";
import { SlippageInput } from "./SlippageInput";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";

type ChainSwitchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: React.ReactNode;
  selectedAsset: AssetInfo;
  selectedStrategy: SelectedStartegy;
  onBorrowRequestSuccess?: () => void;
};

const LEVERAGE_RATE = 100;
type BorrowState = { collateral: bigint; borrow: bigint; leverage: number };

type BorrowAction =
  | { type: "SET_COLLATERAL"; collateral: bigint }
  | { type: "SET_BORROW"; borrow: bigint }
  | { type: "SET_LEVERAGE"; leverage: number }
  | { type: "RESET" };

function computeBorrow(collateral: bigint, leverage: number) {
  return (collateral * BigInt(leverage)) / BigInt(LEVERAGE_RATE);
}
function computeCollateral(borrow: bigint, leverage: number) {
  if (leverage <= 0) return 0n;
  return (borrow * BigInt(LEVERAGE_RATE)) / BigInt(leverage);
}

function borrowReducer(state: BorrowState, action: BorrowAction): BorrowState {
  switch (action.type) {
    case "SET_COLLATERAL": {
      const collateral = action.collateral;
      const borrow = computeBorrow(collateral, state.leverage);
      return { ...state, collateral, borrow };
    }
    case "SET_BORROW": {
      const borrow = action.borrow;
      const collateral = computeCollateral(borrow, state.leverage);
      return { ...state, borrow, collateral };
    }
    case "SET_LEVERAGE": {
      const leverage = action.leverage;
      const borrow = computeBorrow(state.collateral, leverage);
      return { ...state, leverage, borrow };
    }
    case "RESET":
      return { collateral: 0n, borrow: 0n, leverage: 100 };
  }
}

const DEN = 10_000n as const;
const SLIPPAGE_NUM: Record<string, bigint> = {
  "0.1": 9_990n,
  "0.5": 9_950n,
  "1.0": 9_900n,
};

export function minStrategyToReceiveProxy(
  collateralAmountWei: bigint,
  slippage: string
): bigint {
  if (collateralAmountWei <= 0n) return 0n;
  return (collateralAmountWei * SLIPPAGE_NUM[slippage]) / DEN;
}

export function BorrowModal({
  open,
  onOpenChange,
  selectedAsset,
  selectedStrategy,
  onBorrowRequestSuccess,
}: ChainSwitchModalProps) {
  const t = useTranslations("borrow.borrowModal");
  const title = t("title", { assetSymbol: selectedAsset.symbol });
  const [slippage, setSlippage] = useLocalStorage("slippage-borrow-modal", "0.1", v =>
    ["0.1", "0.5", "1.0"].includes(v)
  );
  const [state, dispatch] = useReducer(borrowReducer, {
    collateral: 0n,
    borrow: 0n,
    leverage: 100,
  });
  const { collateral: collateralAmount, borrow: amountToBorrow, leverage } = state;
  const collateralText = state.collateral
    ? formatUnits(state.collateral, selectedAsset.decimals).text
    : "";
  function onCollateralInput(valueStr: string) {
    const next = parseUnits(valueStr || "0", selectedAsset.decimals);
    dispatch({ type: "SET_COLLATERAL", collateral: next });
  }
  function onBorrowInput(valueStr: string) {
    const next = parseUnits(valueStr || "0", selectedAsset.decimals);
    dispatch({ type: "SET_BORROW", borrow: next });
  }
  function onLeverageChange(val: number[]) {
    dispatch({ type: "SET_LEVERAGE", leverage: val[0] });
  }
  const borrowText = state.borrow
    ? formatUnits(state.borrow, selectedAsset.decimals).text
    : "";
  const allowanceInput = {
    address: selectedStrategy.vault.address,
    assetAddress: selectedAsset.address,
    assetSymbol: selectedAsset.symbol,
    assetDecimals: selectedAsset.decimals,
    amount: collateralAmount,
    legacyAllowance: false,
    chainId: selectedStrategy.vault.contract.chainId,
  };
  const {
    allAllowed,
    isPendingApprovals,
    approveMissing,
    ableToRequest,
    refetchAllowances,
  } = useEnsureAllowances([allowanceInput]);
  const { balance } = useERC20TokenBalance({ token: selectedAsset?.address });
  const {
    borrow,
    isPending,
    reset: resetBorrow,
    txState,
  } = useBorrow(
    {
      chainId: selectedStrategy.vault.contract.chainId,
      strategyId: selectedStrategy.id,
      address: selectedStrategy.vault.address,
      assetsToBorrow: amountToBorrow,
      collateralType: 0, // TODO -allow 1 when str tokens as collateral allowed
      collateralAmount: collateralAmount,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      minStrategyToReceive: minStrategyToReceiveProxy(collateralAmount, slippage),
    },
    selectedStrategy.vault,
    {
      onBorrowSuccess: () => {
        toast("Borrow request made successfully");
        onBorrowRequestSuccess?.();
        refetchAllowances();
      },
    }
  );
  const totalAmountToDeposit = BigInt(amountToBorrow || "0");
  const isAmountExceedsBalance =
    selectedAsset !== undefined && balance !== undefined && collateralAmount > balance;

  const actionButtonMeta = (() => {
    if (
      collateralAmount === undefined ||
      collateralAmount === BigInt(0) ||
      totalAmountToDeposit === 0n
    ) {
      return {
        text: "Enter amount",
        disabled: true,
        onClick: undefined,
      };
    }

    if (isAmountExceedsBalance) {
      return {
        text: "Insufficient balance",
        disabled: true,
        onClick: undefined,
      };
    }

    if (allAllowed) {
      return {
        text: isPending ? "Request pending..." : "Borrow",
        disabled:
          isPending ||
          isAmountExceedsBalance ||
          collateralAmount === 0n ||
          amountToBorrow === 0n,
        onClick: () => borrow(),
      };
    }

    if (ableToRequest) {
      return {
        text: isPendingApprovals ? "Approving..." : "Approve",
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

  const stepText = collateralAmount === 0n || !allAllowed ? "1/2" : "2/2";

  const errors = Object.values(txState)
    .map(x => x.errorMessage)
    .filter(Boolean);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        dispatch({ type: "RESET" });
        resetBorrow();
      }}
      title={title}
      size="md"
    >
      <div className="grid grid-cols-1 gap-6 pb-2 md:grid-cols-1 md:pb-6">
        <div className="flex flex-col gap-3 text-center">
          <Heading level="5">Collateral</Heading>
          <AssetInput
            placeholder="0.0"
            value={collateralText}
            onValueChange={evt => onCollateralInput(evt.value)}
            assetSymbol={selectedAsset?.symbol}
            renderAssetImage={() => (
              <AssetImage alt="" address={selectedAsset.address} size={24} />
            )}
          />
          <Card
            className="bg-preset-gray-50 border-none"
            cardBodyClassName="gap-2"
            header={
              <div className="flex items-center justify-between">
                <Heading level="5">Leverage</Heading>
                <div className="text-secondary text-lg">
                  {(leverage / LEVERAGE_RATE).toFixed(2)}x
                </div>
              </div>
            }
          >
            <Slider
              value={[state.leverage]}
              onValueChange={onLeverageChange}
              min={100}
              step={10}
              max={1000}
            />
            <div className="flex justify-between font-mono text-xs">
              <span>1.00x</span>
              <span>Max 10x</span>
            </div>
            <AssetInput
              placeholder="0.0"
              value={borrowText}
              onValueChange={evt => onBorrowInput(evt.value)}
              assetSymbol={selectedAsset?.symbol}
              renderAssetImage={() => (
                <AssetImage alt="" address={selectedAsset.address} size={24} />
              )}
            />
          </Card>
          <SlippageInput
            className="mt-3 md:mt-6"
            value={slippage}
            onChange={setSlippage}
            options={[
              { label: "0.1%", value: "0.1" },
              { label: "0.5%", value: "0.5" },
              { label: "1.0%", value: "1.0" },
            ]}
          />
          <Button
            onClick={actionButtonMeta.onClick}
            disabled={actionButtonMeta.disabled}
            size="lg"
            className="mx-auto mt-6 lg:w-2/3"
          >
            {actionButtonMeta.text}
          </Button>
          <p className="font-mono text-xs">{`Step ${stepText}`}</p>
          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((err, i) => (
                <p key={i} className="text-err-light text-center text-sm">
                  {err}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
