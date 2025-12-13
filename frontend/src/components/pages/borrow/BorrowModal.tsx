"use client";

import { AssetInfo, AssetInfoSchema } from "@diffuse/config";
import {
  AssetInput,
  Button,
  Card,
  Checkbox,
  Dialog,
  Heading,
  RemoteText,
  Select,
  SelectOption,
  Slider,
  Tooltip,
} from "@diffuse/ui-kit";
import now from "lodash/now";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useCallback, useMemo, useReducer } from "react";
import { Controller, useForm } from "react-hook-form";
import { getAddress, parseUnits } from "viem";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { useBorrow } from "@/lib/core/hooks/useBorrow";
import { useBorrowPreview } from "@/lib/core/hooks/useBorrowPreview";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { formatUnits, getPartialAllowanceText } from "@/lib/formatters/asset";
import { formatNumberToKMB } from "@/lib/formatters/number";
import { useRouter } from "@/lib/localization/navigation";
import { useDebounce } from "@/lib/misc/useDebounce";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { toast } from "@/lib/toast";

import { SelectedStartegy } from ".";
import { useERC20TokenBalance } from "../../../lib/wagmi/useErc20TokenBalance";
import { PositionDetails } from "./PositionDetails";
import { SlippageInput } from "./SlippageInput";

type ChainSwitchModalProps = {
  description?: React.ReactNode;
  onBorrowRequestSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedAsset: AssetInfo;
  selectedStrategy: SelectedStartegy;
  title?: ReactNode;
};

const defaultMinLeverage = 100;
const defaultMaxLeverage = 1000;

const LEVERAGE_RATE = 100;
type BorrowAction =
  | { borrow: bigint; type: "SET_BORROW" }
  | { collateral: bigint; type: "SET_COLLATERAL" }
  | { leverage: number; type: "SET_LEVERAGE" }
  | { type: "RESET" };

type BorrowFormValues = {
  acknowledged: boolean;
};

type BorrowState = { borrow: bigint; collateral: bigint; leverage: number };

export function BorrowModal({
  onBorrowRequestSuccess,
  onOpenChange,
  open,
  selectedAsset,
  selectedStrategy,
}: ChainSwitchModalProps) {
  const { control, formState, handleSubmit } = useForm<BorrowFormValues>({
    defaultValues: { acknowledged: false },
    mode: "onSubmit",
  });
  const { errors } = formState;
  const t = useTranslations("borrow.borrowModal");
  const tCommon = useTranslations("common");
  const { refetchLimits, refetchTotalAssets } = useVaults();
  const availableLiquidity = selectedStrategy.vault.availableLiquidity;
  const title = t("title", { assetSymbol: selectedAsset.symbol });
  const [collateralAsset, setCollateralAsset] = useLocalStorage<AssetInfo>(
    "borrow-collateral-asset",
    {
      address: selectedAsset.address,
      chainId: selectedAsset.chainId,
      decimals: selectedAsset.decimals,
      name: selectedAsset.name,
      symbol: selectedAsset.symbol,
    },
    v => AssetInfoSchema.safeParse(v).success
  );
  const [slippage, setSlippage] = useLocalStorage("slippage-borrow-modal", "0.1", v =>
    ["0.1", "0.5", "1.0"].includes(v)
  );
  const router = useRouter();
  const [state, dispatch] = useReducer(borrowReducer, {
    borrow: 0n,
    collateral: 0n,
    leverage: 100,
  });
  const { borrow: amountToBorrow, collateral: collateralAmount, leverage } = state;
  const debouncedCollateral = useDebounce(collateralAmount, 200);
  const debouncedBorrow = useDebounce(amountToBorrow, 200);
  const collateralText = state.collateral
    ? formatUnits(state.collateral, selectedAsset.decimals).text
    : "";
  function onCollateralInput(valueStr: string) {
    const next = parseUnits(valueStr || "0", selectedAsset.decimals);
    dispatch({ collateral: next, type: "SET_COLLATERAL" });
  }
  function onBorrowInput(valueStr: string) {
    const next = parseUnits(valueStr || "0", selectedAsset.decimals);
    dispatch({ borrow: next, type: "SET_BORROW" });
  }
  function onLeverageChange(val: number[]) {
    dispatch({ leverage: val[0], type: "SET_LEVERAGE" });
  }
  const borrowText = state.borrow
    ? formatUnits(state.borrow, selectedAsset.decimals).text
    : "";
  const onSuccessAllowance = useCallback(() => {
    toast(t("toasts.approveSuccess"));
  }, [t]);
  const allowanceInput = {
    address: selectedStrategy.vault.address,
    amount: collateralAmount,
    assetAddress: collateralAsset.address,
    assetDecimals: collateralAsset.decimals,
    assetSymbol: collateralAsset.symbol,
    chainId: selectedStrategy.vault.contract.chainId,
    legacyAllowance: false,
  };
  const {
    ableToRequest,
    allAllowed,
    allowances,
    approveMissing,
    isPendingApprovals,
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
      address: selectedStrategy.vault.address,
      assetDecimals: selectedAsset.decimals,
      assetsToBorrow: debouncedBorrow,
      assetSymbol: selectedAsset.symbol,
      chainId: selectedStrategy.vault.contract.chainId,
      collateralAmount: debouncedCollateral,
      collateralType:
        getAddress(collateralAsset.address) === getAddress(selectedAsset.address) ? 0 : 1,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      slippage,
      strategyId: selectedStrategy.id,
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
    onBorrowError: error => {
      toast(t("toasts.borrowError", { error }));
    },
    onBorrowSuccess: () => {
      toast(t("toasts.borrowSuccess"));
      onBorrowRequestSuccess?.();
      refetchAllowances();
      refetchTotalAssets();
      refetchLimits();
      router.push("/borrow/my-positions");
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
      collateralAmount === 0n ||
      totalAmountToBorrow === 0n
    ) {
      return {
        disabled: true,
        onClick: undefined,
        text: t("enterAmount"),
      };
    }

    if (isAmountExceedsBalance) {
      return {
        disabled: true,
        onClick: undefined,
        text: t("insufficientBalance"),
      };
    }

    if (collateralAmount > availableLiquidity) {
      return {
        disabled: true,
        onClick: undefined,
        text: t("exceedsLiquidity"),
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
        disabled:
          isPending ||
          isAmountExceedsBalance ||
          collateralAmount === 0n ||
          amountToBorrow === 0n,
        onClick: () => borrow(),
        text: isPending ? t("requestPending") : t("borrow"),
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
            <div className="leading-none">{t("approve")}</div>
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
      };
    }

    return {
      disabled: true,
      onClick: undefined,
      text: t("enterAmount"),
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

  const { error, isFetching, isLoading, liquidationPriceWad, predictedTokensToReceive } =
    useBorrowPreview(borrowInput, selectedStrategy.vault);
  const borrowPreviewLoadingDisplayed = isLoading || isFetching;

  const availableLiquidityUnits = formatUnits(availableLiquidity, selectedAsset.decimals);
  const availableLiquidityFormatted = formatNumberToKMB(
    Number(availableLiquidityUnits.meta!.rawViem)
  );

  return (
    <Dialog
      onOpenChange={() => {
        onOpenChange(false);
        dispatch({ type: "RESET" });
        resetBorrow();
      }}
      open={open}
      size="lg"
      title={title}
    >
      <div className="grid grid-cols-1 gap-10 pb-2 md:grid-cols-2 md:pb-6">
        <div className="flex flex-col gap-4 text-center">
          <Heading level="5">{t("collateral")}</Heading>
          <div className="flex flex-col gap-2">
            <div className="flex flex-nowrap items-center gap-2">
              <AssetInput
                className="flex-1"
                onValueChange={evt => onCollateralInput(evt.value)}
                placeholder="0.0"
                value={collateralText}
              />
              <Select
                aria-label={t("selectCollateralAsset")}
                onValueChange={val =>
                  getAddress(val) === getAddress(selectedAsset.address)
                    ? setCollateralAsset(selectedAsset)
                    : setCollateralAsset(selectedStrategy.token as AssetInfo)
                }
                options={selectOptions}
                value={getAddress(collateralAsset.address)}
              />
            </div>
            <div className="text-muted pl-2 text-left font-mono text-xs whitespace-nowrap">
              {t("balance", {
                amount: balanceDisplay ? balanceDisplay.text : "N/A",
                symbol: collateralAsset.symbol,
              })}
            </div>
          </div>
          <Card
            cardBodyClassName="gap-2"
            className="bg-preset-gray-50 border-none"
            header={
              <div className="flex items-center justify-between">
                <Heading level="5">{tCommon("leverage")}</Heading>
                <div className="text-secondary text-lg">
                  {(leverage / LEVERAGE_RATE).toFixed(2)}x
                </div>
              </div>
            }
          >
            <Slider
              max={selectedStrategy.maxLeverage || defaultMaxLeverage}
              min={selectedStrategy.minLeverage || defaultMinLeverage}
              onValueChange={onLeverageChange}
              step={10}
              value={[leverage]}
            />
            <div className="flex justify-between font-mono text-xs">
              <span>{t("minLeverage")}</span>
              <span>{t("maxLeverage")}</span>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <AssetInput
                assetSymbol={selectedAsset?.symbol}
                onValueChange={evt => onBorrowInput(evt.value)}
                placeholder="0.0"
                renderAssetImage={() => (
                  <AssetImage
                    address={selectedAsset.address}
                    alt=""
                    imgURI={selectedAsset.logoURI}
                    size={24}
                  />
                )}
                value={borrowText}
              />
              <p className="text-muted font-mono text-xs">
                {t("availableForBorrow", {
                  amount: availableLiquidityFormatted.text,
                  symbol: selectedAsset.symbol,
                })}
              </p>
            </div>
          </Card>
          <SlippageInput
            className="mt-3 md:mt-6"
            onChange={setSlippage}
            options={[
              { label: "0.1%", value: "0.1" },
              { label: "0.5%", value: "0.5" },
              { label: "1.0%", value: "1.0" },
            ]}
            value={slippage}
          />
          <Controller
            control={control}
            name="acknowledged"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                className="mt-4"
                error={errors.acknowledged?.message}
                label={tCommon("acknowledgements")}
                onCheckedChange={val => field.onChange(val === true)}
              />
            )}
            rules={{
              validate: v => v || tCommon("acknowledgementsError"),
            }}
          />
          <Button
            className="mx-auto mt-6 lg:w-2/3"
            disabled={actionButtonMeta.disabled}
            onClick={handleSubmit(() => {
              if (actionButtonMeta.onClick) {
                actionButtonMeta.onClick();
              }
            })}
            size="lg"
          >
            {actionButtonMeta.text}
          </Button>
          <p className="font-mono text-xs">{t("step", { step: stepText })}</p>
        </div>
        <div className="flex flex-col gap-8">
          <Heading level="5">{t("positionDetails")}</Heading>
          <div className="flex flex-nowrap justify-between gap-4 pr-2 overflow-ellipsis">
            <Heading className="text-text-dimmed" level="6">
              {t("totalBalance")}
            </Heading>
            <RemoteText
              error={error?.message}
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
            />
          </div>
          <PositionDetails
            collateralGiven={collateralAmount}
            enterTimeOrDeadline={now()}
            leverage={BigInt(leverage)}
            liquidationPenalty={selectedStrategy.vault.feeData.liquidationFee}
            liquidationPrice={liquidationPriceWad}
            liquidationPriceLoadingError={error?.message}
            loadingLiquidationPrice={borrowPreviewLoadingDisplayed}
            selectedAsset={selectedAsset}
            spreadFee={selectedStrategy.vault.feeData.spreadFee}
            strategy={selectedStrategy}
          />
        </div>
      </div>
    </Dialog>
  );
}
function borrowReducer(state: BorrowState, action: BorrowAction): BorrowState {
  switch (action.type) {
    case "RESET": {
      return { borrow: 0n, collateral: 0n, leverage: 100 };
    }
    case "SET_BORROW": {
      const borrow = action.borrow;
      const collateral = computeCollateral(borrow, state.leverage);
      return { ...state, borrow, collateral };
    }
    case "SET_COLLATERAL": {
      const collateral = action.collateral;
      const borrow = computeBorrow(collateral, state.leverage);
      return { ...state, borrow, collateral };
    }
    case "SET_LEVERAGE": {
      const leverage = action.leverage;
      const borrow = computeBorrow(state.collateral, leverage);
      return { ...state, borrow, leverage };
    }
  }
}

function computeBorrow(collateral: bigint, leverage: number) {
  return (collateral * BigInt(leverage)) / BigInt(LEVERAGE_RATE);
}

function computeCollateral(borrow: bigint, leverage: number) {
  if (leverage <= 0) return 0n;
  return (borrow * BigInt(LEVERAGE_RATE)) / BigInt(leverage);
}
