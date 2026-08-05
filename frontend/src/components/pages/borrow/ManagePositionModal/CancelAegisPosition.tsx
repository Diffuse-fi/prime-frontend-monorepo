import type { Address } from "viem";

import { Button, Heading } from "@diffuse/ui-kit";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { isAegisStrategy } from "@/lib/aegis";
import { useAegisExit } from "@/lib/aegis/useAegisExit";
import { BorrowerPosition } from "@/lib/core/types";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { toast } from "@/lib/toast";

import { SlippageInput } from "../SlippageInput";

interface CancelAegisPositionProps {
  collateralAssetAddress: Address;
  onPositionClosure?: () => void;
  selectedPosition: BorrowerPosition;
}

export function CancelAegisPosition({
  collateralAssetAddress,
  onPositionClosure,
  selectedPosition,
}: CancelAegisPositionProps) {
  const t = useTranslations("borrow.managePositionModal");

  const [slippage, setSlippage] = useLocalStorage(
    "slippage-manage-position-modal-aegis",
    "0.1",
    v => ["0.1", "0.5", "1.0"].includes(v)
  );

  const selected = useMemo(() => {
    return {
      address: selectedPosition.vault.address,
      chainId: selectedPosition.vault.contract.chainId,
      collateralAsset: collateralAssetAddress,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      isAegisStrategy: isAegisStrategy(selectedPosition.strategy),
      positionId: selectedPosition.id,
      slippage,
      strategyId: selectedPosition.strategyId,
    };
  }, [selectedPosition, slippage, collateralAssetAddress]);

  const {
    finalize,
    isPending,
    lock,
    redeem,
    refetchStage,
    someAwaitingSignature,
    stage,
  } = useAegisExit(selected, selectedPosition.vault, {
    onError: e => toast(t("toasts.closeError", { error: e })),
    onSuccess: () => {
      toast(t("toasts.positionClosed"));
      onPositionClosure?.();
    },
  });

  const stageNum = stage?.stage;
  const stageReady = stageNum !== undefined && stageNum !== null;

  const primary = useMemo(() => {
    if (!selected.isAegisStrategy) {
      return {
        disabled: true,
        label: "Not an Aegis strategy",
        onClick: undefined,
      };
    }

    if (!stageReady) {
      return {
        disabled: true,
        label: "Loading…",
        onClick: undefined,
      };
    }

    if (someAwaitingSignature) {
      return {
        disabled: true,
        label: t("confirmingInWallet"),
        onClick: undefined,
      };
    }

    if (stageNum === 0) {
      return {
        disabled: false,
        label: "Start exit",
        onClick: () => lock(),
      };
    }

    if (stageNum === 1) {
      return {
        disabled: false,
        label: "Submit redeem request",
        onClick: () => redeem(),
      };
    }

    if (stageNum === 2) {
      return {
        disabled: true,
        label: "Waiting for approval…",
        onClick: undefined,
      };
    }

    if (stageNum === 3) {
      return {
        disabled: false,
        label: "Finalize",
        onClick: () => finalize(),
      };
    }

    return {
      disabled: true,
      label: "Status unavailable",
      onClick: undefined,
    };
  }, [
    finalize,
    lock,
    redeem,
    selected.isAegisStrategy,
    someAwaitingSignature,
    stageNum,
    stageReady,
    t,
  ]);

  const showRefresh = stageNum === 2 || stageNum === -1;

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 px-5">
          <TriangleAlert aria-hidden className="text-err h-6 w-6 shrink-0" />
          <Heading className="text-text-dimmed" level="5">
            {t("positionClosure")}
          </Heading>
        </div>

        <p className="text-err px-5">{t("closureWarning")}</p>

        <div className="bg-muted/15 gap-4 rounded-md px-6 py-4">
          <Heading className="text-text-dimmed" level="5">
            {stage?.message ?? t("feesUnavailable")}
          </Heading>
          <p className="text-muted mt-4 text-sm">
            {selected.isAegisStrategy
              ? "Aegis exit is multi-step and may take time."
              : "Not an Aegis strategy."}
          </p>
        </div>

        <SlippageInput
          className="px-5"
          onChange={setSlippage}
          options={[
            { label: "0.1%", value: "0.1" },
            { label: "0.5%", value: "0.5" },
            { label: "1.0%", value: "1.0" },
          ]}
          value={slippage}
        />

        <div className="grid grid-cols-1 gap-3 px-5">
          <Button
            disabled={isPending || primary.disabled}
            onClick={primary.onClick}
            size="lg"
          >
            {primary.label}
          </Button>

          {showRefresh ? (
            <Button
              disabled={isPending}
              onClick={() => refetchStage()}
              size="lg"
              variant="ghost"
            >
              Refresh status
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
