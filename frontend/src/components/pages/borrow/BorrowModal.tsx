"use client";

import { useTranslations } from "next-intl";
import { AssetInfo, AssetInfoSchema } from "@/lib/assets/validations";
import {
  AssetInput,
  Button,
  Card,
  Dialog,
  Heading,
  RemoteText,
  Select,
  SelectOption,
  Slider,
  Tooltip,
} from "@diffuse/ui-kit";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { useERC20TokenBalance } from "@/lib/wagmi/useERC20TokenBalance";
import { formatUnits, getPartialAllowanceText } from "@/lib/formatters/asset";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { getAddress, parseUnits } from "viem";
import { useBorrow } from "@/lib/core/hooks/useBorrow";
import { toast } from "@/lib/toast";
import { SelectedStartegy } from ".";
import { ReactNode, useCallback, useMemo, useReducer } from "react";
import { SlippageInput } from "./SlippageInput";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { PositionDetails } from "./PositionDetails";
import now from "lodash/now";
import { formatNumberToKMB } from "@/lib/formatters/number";
import { useBorrowPreview } from "@/lib/core/hooks/useBorrowPreview";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { useRouter } from "@/lib/localization/navigation";
import { InfoIcon } from "lucide-react";
import { useDebounce } from "@/lib/misc/useDebounce";

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

export function BorrowModal({
  open,
  onOpenChange,
  selectedAsset,
  selectedStrategy,
  onBorrowRequestSuccess,
}: ChainSwitchModalProps) {
  const t = useTranslations("borrow.borrowModal");
  const { refetchTotalAssets, refetchLimits } = useVaults();
  const availableLiquidity = selectedStrategy.vault.availableLiquidity;
  const title = t("title", { assetSymbol: selectedAsset.symbol });
  const [collateralAsset, setCollateralAsset] = useLocalStorage<AssetInfo>(
    "borrow-collateral-asset",
    {
      symbol: selectedAsset.symbol,
      address: selectedAsset.address,
      decimals: selectedAsset.decimals,
      chainId: selectedAsset.chainId,
      name: selectedAsset.name,
    },
    v => AssetInfoSchema.safeParse(v).success
  );
  const [slippage, setSlippage] = useLocalStorage("slippage-borrow-modal", "0.1", v =>
    ["0.1", "0.5", "1.0"].includes(v)
  );
  const router = useRouter();
  const [state, dispatch] = useReducer(borrowReducer, {
    collateral: 0n,
    borrow: 0n,
    leverage: 100,
  });
  const { collateral: collateralAmount, borrow: amountToBorrow, leverage } = state;
  const debouncedCollateral = useDebounce(collateralAmount, 200);
  const debouncedBorrow = useDebounce(amountToBorrow, 200);
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
  const onSuccessAllowance = useCallback(() => {
    toast("Approval successful");
  }, []);
  const allowanceInput = {
    address: selectedStrategy.vault.address,
    assetAddress: collateralAsset.address,
    assetSymbol: collateralAsset.symbol,
    assetDecimals: collateralAsset.decimals,
    amount: collateralAmount,
    legacyAllowance: false,
    chainId: selectedStrategy.vault.contract.chainId,
  };
  const {
    allAllowed,
    isPendingApprovals,
    approveMissing,
    allowances,
    ableToRequest,
    refetchAllowances,
  } = useEnsureAllowances([allowanceInput], {
    onSuccess: onSuccessAllowance,
  });
  const { balance: selectedAssetBalance } = useERC20TokenBalance({
    token: selectedAsset?.address,
  });
  const { balance: strategyTokenBalance } = useERC20TokenBalance({
    token: selectedStrategy.token.address,
  });

  const balance =
    getAddress(collateralAsset.address) === getAddress(selectedAsset.address)
      ? selectedAssetBalance
      : getAddress(collateralAsset.address) === getAddress(selectedStrategy.token.address)
        ? strategyTokenBalance
        : undefined;
  const balanceDisplay =
    balance !== undefined && balance !== null
      ? formatNumberToKMB(
          Number(formatUnits(balance, collateralAsset.decimals).meta!.rawViem)
        )
      : undefined;

  const borrowInput = useMemo(
    () => ({
      chainId: selectedStrategy.vault.contract.chainId,
      strategyId: selectedStrategy.id,
      address: selectedStrategy.vault.address,
      assetsToBorrow: debouncedBorrow,
      collateralType:
        getAddress(collateralAsset.address) === getAddress(selectedAsset.address) ? 0 : 1,
      collateralAmount: debouncedCollateral,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      slippage,
      assetDecimals: selectedAsset.decimals,
      assetSymbol: selectedAsset.symbol,
    }),
    [
      debouncedBorrow,
      debouncedCollateral,
      collateralAsset.address,
      selectedAsset.address,
      selectedStrategy.id,
      selectedStrategy.vault.address,
      slippage,
      selectedStrategy.vault.contract.chainId,
      selectedAsset.decimals,
      selectedAsset.symbol,
    ]
  );

  const {
    borrow,
    isPending,
    reset: resetBorrow,
    txState,
  } = useBorrow(borrowInput, selectedStrategy.vault, {
    onBorrowSuccess: () => {
      toast("Borrow request made successfully");
      onBorrowRequestSuccess?.();
      refetchAllowances();
      refetchTotalAssets();
      refetchLimits();
      router.push("/borrow/my-positions");
    },
    onBorrowError: error => {
      toast(`Borrow request failed: ${error}`);
    },
  });
  const totalAmountToBorrow = BigInt(amountToBorrow || "0");
  const isAmountExceedsBalance =
    selectedAsset !== undefined && balance !== undefined && collateralAmount > balance;

  const confirmingInWallet = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );
  const currentlyAllowed = allowances?.find(
    a => a.vault.address === selectedStrategy.vault.address
  )?.current;

  const actionButtonMeta = (() => {
    if (
      collateralAmount === undefined ||
      collateralAmount === BigInt(0) ||
      totalAmountToBorrow === 0n
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

    if (collateralAmount > availableLiquidity) {
      return {
        text: "Exceeds available liquidity",
        disabled: true,
        onClick: undefined,
      };
    }

    if (allAllowed) {
      if (confirmingInWallet) {
        return {
          text: "Confirming...",
          disabled: true,
          onClick: undefined,
        };
      }

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
        text: isPendingApprovals ? (
          "Approving..."
        ) : (
          <div className="flex items-center gap-1">
            <div className="leading-none">Approve</div>
            {currentlyAllowed !== null && currentlyAllowed !== undefined ? (
              <Tooltip
                content={getPartialAllowanceText(
                  currentlyAllowed,
                  collateralAmount,
                  collateralAsset.decimals,
                  collateralAsset.symbol
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
      text: "Enter amount",
      disabled: true,
      onClick: undefined,
    };
  })();

  const stepText = collateralAmount === 0n || !allAllowed ? "1/2" : "2/2";

  const selectOptions: SelectOption[] = [
    {
      label: selectedAsset.symbol,
      value: selectedAsset.address,
    },
    {
      label: selectedStrategy.token.symbol,
      value: selectedStrategy.token.address,
    },
  ];

  const { isLoading, isFetching, predictedTokensToReceive, liquidationPriceWad, error } =
    useBorrowPreview(borrowInput, selectedStrategy.vault);
  const borrowPreviewLoadingDisplayed = isLoading || isFetching;

  const availableLiquidityUnits = formatUnits(availableLiquidity, selectedAsset.decimals);
  const availableLiquidityFormatted = formatNumberToKMB(
    Number(availableLiquidityUnits.meta!.rawViem)
  );

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        dispatch({ type: "RESET" });
        resetBorrow();
      }}
      title={title}
      size="lg"
    >
      <div className="grid grid-cols-1 gap-10 pb-2 md:grid-cols-2 md:pb-6">
        <div className="flex flex-col gap-4 text-center">
          <Heading level="5">Collateral</Heading>
          <div className="flex flex-col gap-2">
            <div className="flex flex-nowrap items-center gap-2">
              <AssetInput
                className="flex-1"
                placeholder="0.0"
                value={collateralText}
                onValueChange={evt => onCollateralInput(evt.value)}
              />
              <Select
                value={getAddress(collateralAsset.address)}
                options={selectOptions}
                onValueChange={val =>
                  getAddress(val) === getAddress(selectedAsset.address)
                    ? setCollateralAsset(selectedAsset)
                    : setCollateralAsset(selectedStrategy.token as AssetInfo)
                }
                aria-label="Select collateral asset"
              />
            </div>
            <div className="text-muted pl-2 text-left font-mono text-xs whitespace-nowrap">{`Balance ${collateralAsset.symbol}: ${balanceDisplay ? balanceDisplay.text : "N/A"}`}</div>
          </div>
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
              value={[leverage]}
              onValueChange={onLeverageChange}
              min={100}
              step={10}
              max={1000}
            />
            <div className="flex justify-between font-mono text-xs">
              <span>1.00x</span>
              <span>Max 10x</span>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <AssetInput
                placeholder="0.0"
                value={borrowText}
                onValueChange={evt => onBorrowInput(evt.value)}
                assetSymbol={selectedAsset?.symbol}
                renderAssetImage={() => (
                  <AssetImage
                    alt=""
                    address={selectedAsset.address}
                    imgURI={selectedAsset.logoURI}
                    size={24}
                  />
                )}
              />
              <p className="text-muted font-mono text-xs">
                {`Available for borrow ${selectedAsset.symbol}: ${availableLiquidityFormatted.text}`}
              </p>
            </div>
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
        </div>
        <div className="flex flex-col gap-8">
          <Heading level="5">Position details</Heading>
          <div className="flex flex-nowrap justify-between gap-4 pr-2 overflow-ellipsis">
            <Heading level="6" className="text-text-dimmed">
              Total balance
            </Heading>
            <RemoteText
              isLoading={borrowPreviewLoadingDisplayed}
              text={
                predictedTokensToReceive
                  ? `${
                      formatUnits(
                        predictedTokensToReceive,
                        selectedStrategy.token.decimals
                      ).text
                    } ${selectedStrategy.token.symbol}`
                  : "N/A"
              }
              error={error?.message}
            />
          </div>
          <PositionDetails
            strategy={selectedStrategy}
            selectedAsset={selectedAsset}
            collateralGiven={collateralAmount}
            leverage={BigInt(leverage)}
            liquidationPrice={liquidationPriceWad}
            enterTimeOrDeadline={now()}
            loadingLiquidationPrice={borrowPreviewLoadingDisplayed}
            liquidationPriceLoadingError={error?.message}
            spreadFee={selectedStrategy.vault.feeData.spreadFee}
            liquidationPenalty={selectedStrategy.vault.feeData.liquidationFee}
          />
        </div>
      </div>
    </Dialog>
  );
}
