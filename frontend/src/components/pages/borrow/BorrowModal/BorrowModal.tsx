"use client";

import { AssetInfo } from "@diffuse/config";
import {
  AssetInput,
  Button,
  Card,
  Checkbox,
  cn,
  Dialog,
  Heading,
  RemoteText,
  Select,
  SelectOption,
  Slider,
  Tooltip,
} from "@diffuse/ui-kit";
import { InfoIcon, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { getAddress, parseUnits } from "viem";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { isAegisStrategy } from "@/lib/aegis";
import { useBorrow } from "@/lib/core/hooks/useBorrow";
import { useBorrowPreview } from "@/lib/core/hooks/useBorrowPreview";
import { useCollateralInSelectedAsset } from "@/lib/core/hooks/useCollateralInSelectedAsset";
import { useEnsureAllowances } from "@/lib/core/hooks/useEnsureAllowances";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { formatUnits, getPartialAllowanceText } from "@/lib/formatters/asset";
import { formatNumberToKMB } from "@/lib/formatters/number";
import { useRouter } from "@/lib/localization/navigation";
import { useDebounce } from "@/lib/misc/useDebounce";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { toast } from "@/lib/toast";
import { useERC20TokenBalance } from "@/lib/wagmi/useErc20TokenBalance";

import { PositionDetails } from "../PositionDetails";
import { SlippageInput } from "../SlippageInput";
import { SelectedStrategy } from "../types";
import { resolveBorrowInputChange } from "./borrowInputModel";
import {
  borrowReducer,
  computeBorrow,
  convertDecimals,
  defaultMinLeverage,
  getLeverageBounds,
  LEVERAGE_RATE,
  leverageAdjustmentForPt,
} from "./borrowReducer";

type BorrowFormValues = {
  acknowledged: boolean;
};

type ChainSwitchModalProps = {
  description?: React.ReactNode;
  onBorrowRequestSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedAsset: AssetInfo;
  selectedStrategy: SelectedStrategy;
  title?: ReactNode;
};

export function BorrowModal({
  onBorrowRequestSuccess,
  onOpenChange,
  open,
  selectedAsset,
  selectedStrategy,
}: ChainSwitchModalProps) {
  const isAegis = isAegisStrategy(selectedStrategy);
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

  const [collateralAsset, setCollateralAsset] = useState<AssetInfo>({
    address: selectedAsset.address,
    chainId: selectedAsset.chainId,
    decimals: selectedAsset.decimals,
    name: selectedAsset.name,
    symbol: selectedAsset.symbol,
  });

  const [slippage, setSlippage] = useLocalStorage("slippage-borrow-modal", "0.1", v =>
    ["0.1", "0.5", "1.0"].includes(v)
  );

  const router = useRouter();

  const [state, dispatch] = useReducer(borrowReducer, {
    borrow: 0n,
    collateral: 0n,
    leverage:
      getAddress(collateralAsset.address) === getAddress(selectedAsset.address)
        ? defaultMinLeverage
        : defaultMinLeverage + leverageAdjustmentForPt,
  });

  const { borrow: amountToBorrow, collateral: collateralAmount, leverage } = state;

  const lastInputRef = useRef<"borrow" | "collateral" | null>(null);
  const didInitCollateralType = useRef(false);

  const debouncedCollateral = useDebounce(collateralAmount, 200);
  const debouncedBorrow = useDebounce(amountToBorrow, 200);

  const collateralAssetAddress = getAddress(collateralAsset.address);
  const selectedAssetAddress = getAddress(selectedAsset.address);
  const strategyAssetAddress = getAddress(selectedStrategy.token.address);

  const { leverageMax, leverageMin } = useMemo(
    () =>
      getLeverageBounds({
        collateralAssetAddress,
        maxLeverage: selectedStrategy.maxLeverage,
        minLeverage: selectedStrategy.minLeverage,
        selectedAssetAddress,
      }),
    [
      collateralAssetAddress,
      selectedAssetAddress,
      selectedStrategy.maxLeverage,
      selectedStrategy.minLeverage,
    ]
  );

  const { amount: collateralInSelectedAsset, isStrategyCollateral } =
    useCollateralInSelectedAsset({
      collateralAmount: debouncedCollateral,
      collateralAsset,
      selectedAsset,
      strategy: selectedStrategy,
      vault: selectedStrategy.vault,
    });

  const isCollateralDebounced = debouncedCollateral === collateralAmount;

  const collateralInSelectedAssetForBorrow = useMemo(() => {
    if (isStrategyCollateral) {
      return isCollateralDebounced ? collateralInSelectedAsset : null;
    }

    return convertDecimals(
      collateralAmount,
      collateralAsset.decimals,
      selectedAsset.decimals
    );
  }, [
    collateralAmount,
    collateralAsset.decimals,
    collateralInSelectedAsset,
    isCollateralDebounced,
    isStrategyCollateral,
    selectedAsset.decimals,
  ]);

  function onCollateralInput(valueStr: string) {
    const next = parseUnits(valueStr || "0", collateralAsset.decimals);
    lastInputRef.current = "collateral";

    dispatch({
      borrowDecimals: selectedAsset.decimals,
      collateral: next,
      collateralDecimals: collateralAsset.decimals,
      type: "SET_COLLATERAL",
    });
  }

  function onBorrowInput(valueStr: string) {
    const nextBorrow = parseUnits(valueStr || "0", selectedAsset.decimals);

    const result = resolveBorrowInputChange({
      collateralAmount,
      collateralAssetDecimals: collateralAsset.decimals,
      collateralInSelectedAssetForBorrow,
      isStrategyCollateral,
      leverageMax,
      leverageMin,
      nextBorrow,
      selectedAssetDecimals: selectedAsset.decimals,
    });

    if (result.kind === "SET_BORROW_ONLY") {
      lastInputRef.current = "borrow";
      dispatch({
        borrow: result.borrow,
        borrowDecimals: selectedAsset.decimals,
        collateralDecimals: collateralAsset.decimals,
        type: "SET_BORROW",
      });
      return;
    }

    if (result.kind === "SET_LEVERAGE_ONLY") {
      lastInputRef.current = "collateral";
      dispatch({
        borrowDecimals: selectedAsset.decimals,
        collateralDecimals: collateralAsset.decimals,
        leverage: result.leverage,
        type: "SET_LEVERAGE",
      });
      return;
    }

    lastInputRef.current = "collateral";

    dispatch({
      borrowDecimals: selectedAsset.decimals,
      collateralDecimals: collateralAsset.decimals,
      leverage: result.leverage,
      type: "SET_LEVERAGE",
    });

    dispatch({
      borrowDecimals: selectedAsset.decimals,
      collateral: result.collateral,
      collateralDecimals: collateralAsset.decimals,
      type: "SET_COLLATERAL",
    });
  }

  function onLeverageChange(val: number[]) {
    lastInputRef.current = "collateral";
    dispatch({
      borrowDecimals: selectedAsset.decimals,
      collateralDecimals: collateralAsset.decimals,
      leverage: val[0],
      type: "SET_LEVERAGE",
    });
  }

  const onCollateralAssetChange = useCallback(
    (val: string) => {
      const nextAsset =
        getAddress(val) === selectedAssetAddress ? selectedAsset : selectedStrategy.token;

      dispatch({
        borrowDecimals: selectedAsset.decimals,
        collateralDecimals: nextAsset.decimals,
        leverage:
          getAddress(nextAsset.address) === selectedAssetAddress
            ? defaultMinLeverage
            : defaultMinLeverage + leverageAdjustmentForPt,
        type: "SET_LEVERAGE",
      });

      const nextCollateral = convertDecimals(
        state.collateral,
        collateralAsset.decimals,
        nextAsset.decimals
      );

      setCollateralAsset(nextAsset);
      lastInputRef.current = "collateral";

      dispatch({
        borrowDecimals: selectedAsset.decimals,
        collateral: nextCollateral,
        collateralDecimals: nextAsset.decimals,
        type: "SET_COLLATERAL",
      });
    },
    [
      collateralAsset.decimals,
      selectedAssetAddress,
      selectedStrategy.token,
      state.collateral,
      selectedAsset,
    ]
  );

  useEffect(() => {
    if (!open || didInitCollateralType.current) return;
    didInitCollateralType.current = true;

    if (collateralAssetAddress !== selectedAssetAddress) {
      onCollateralAssetChange(selectedAsset.address);
    }
  }, [
    collateralAssetAddress,
    onCollateralAssetChange,
    open,
    selectedAsset.address,
    selectedAssetAddress,
  ]);

  useEffect(() => {
    if (lastInputRef.current !== "collateral") return;
    if (collateralInSelectedAssetForBorrow === null) return;

    const borrow = computeBorrow(collateralInSelectedAssetForBorrow, leverage);

    dispatch({
      borrow,
      borrowDecimals: selectedAsset.decimals,
      collateralDecimals: collateralAsset.decimals,
      type: "SET_BORROW",
    });
  }, [
    collateralAsset.decimals,
    collateralInSelectedAssetForBorrow,
    leverage,
    selectedAsset.decimals,
  ]);

  const collateralText = state.collateral
    ? formatUnits(state.collateral, collateralAsset.decimals).text
    : "";

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

  let balance: typeof selectedAssetBalance | typeof strategyTokenBalance | undefined;
  if (collateralAssetAddress === selectedAssetAddress) {
    balance = selectedAssetBalance;
  } else if (collateralAssetAddress === strategyAssetAddress) {
    balance = strategyTokenBalance;
  }

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
      collateralType: collateralAssetAddress === selectedAssetAddress ? 0 : 1,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      slippage,
      strategyId: selectedStrategy.id,
    }),
    [
      collateralAssetAddress,
      debouncedBorrow,
      debouncedCollateral,
      selectedAsset.decimals,
      selectedAsset.symbol,
      selectedAssetAddress,
      selectedStrategy.id,
      selectedStrategy.vault.address,
      selectedStrategy.vault.contract.chainId,
      slippage,
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

  const exceedsAvailableLiquidity = totalAmountToBorrow > availableLiquidity;

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

    if (exceedsAvailableLiquidity) {
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
      disabled: isAegis,
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
                onValueChange={onCollateralAssetChange}
                options={selectOptions}
                value={collateralAssetAddress}
              />
            </div>

            <div className="text-muted pl-2 text-left font-mono text-xs whitespace-nowrap">
              {t("balance", {
                amount: balanceDisplay ? balanceDisplay.text : "N/A",
                symbol: collateralAsset.symbol,
              })}
            </div>

            {isAegis && (
              <p className="text-warn flex items-start gap-1 pl-2 text-left text-xs">
                <TriangleAlert aria-hidden className="text-warn h-3 w-3 shrink-0" />
                {t("aegisCollateralWarning")}
              </p>
            )}
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
              max={leverageMax}
              min={leverageMin}
              onValueChange={onLeverageChange}
              step={10}
              value={[leverage]}
            />

            <div className="flex justify-between font-mono text-xs">
              <span>{`${(leverageMin / LEVERAGE_RATE).toFixed(2)}x`}</span>
              <span>{`${(leverageMax / LEVERAGE_RATE).toFixed(2)}x`}</span>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <AssetInput
                assetSymbol={selectedAsset?.symbol}
                error={exceedsAvailableLiquidity}
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
              <p
                className={cn(
                  "font-mono text-xs",
                  exceedsAvailableLiquidity ? "text-err" : "text-muted"
                )}
              >
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

          {isAegis && (
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
          )}

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
            borrowedAmount={amountToBorrow}
            collateralAsset={collateralAsset}
            collateralGiven={collateralAmount}
            leverage={BigInt(leverage)}
            liquidationPenalty={selectedStrategy.vault.feeData.liquidationFee}
            liquidationPrice={liquidationPriceWad}
            liquidationPriceLoadingError={error?.message}
            loadingLiquidationPrice={borrowPreviewLoadingDisplayed}
            selectedAsset={selectedAsset}
            spreadFee={selectedStrategy.vault.feeData.spreadFee}
            strategy={selectedStrategy}
            totalBalance={predictedTokensToReceive}
            vault={selectedStrategy.vault}
          />
        </div>
      </div>
    </Dialog>
  );
}
