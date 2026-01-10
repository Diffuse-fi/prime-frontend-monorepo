import type { Address } from "viem";

import { Button, Heading } from "@diffuse/ui-kit";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useAegisExit } from "@/lib/aegis/useAegisExit";
import { BorrowerPosition } from "@/lib/core/types";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { toast } from "@/lib/toast";

import { SlippageInput } from "../SlippageInput";

interface CancelAegisPositionProps {
  collateralOptions: Array<{ address: Address; label: string }>;
  onPositionClosure?: () => void;
  primeApiBaseUrl: string;
  selectedPosition: BorrowerPosition;
}

export function CancelAegisPosition({
  collateralOptions,
  onPositionClosure,
  selectedPosition,
}: CancelAegisPositionProps) {
  const t = useTranslations("borrow.managePositionModal");

  const [slippage, setSlippage] = useLocalStorage(
    "slippage-manage-position-modal-aegis",
    "0.1",
    v => ["0.1", "0.5", "1.0"].includes(v)
  );

  const [collateralAsset, setCollateralAsset] = useState<Address>(
    collateralOptions[0]?.address ??
      ("0x0000000000000000000000000000000000000000" as Address)
  );

  const selected = useMemo(() => {
    const name = (selectedPosition.asset.name ?? "").toLowerCase();

    return {
      address: selectedPosition.vault.address,
      chainId: selectedPosition.vault.contract.chainId,
      collateralAsset,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      isAegisStrategy: name.includes("aegis"),
      positionId: selectedPosition.id,
      slippage,
      strategyId: selectedPosition.strategyId,
    };
  }, [selectedPosition, slippage, collateralAsset]);

  const {
    finalize,
    isPending,
    lock,
    redeem,
    refetchStage,
    someAwaitingSignature,
    stage,
  } = useAegisExit(selected, {
    onError: e => toast(t("toasts.closeError", { error: e })),
    onSuccess: () => {
      toast(t("toasts.positionClosed"));
      onPositionClosure?.();
    },
  });

  const canStart = stage?.stage === 0;
  const canRedeem = stage?.stage === 1;
  const isWaiting = stage?.stage === 2;
  const canFinalize = stage?.stage === 2 || stage?.stage === 3;

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

        <div className="px-5">
          <label className="text-text-dimmed text-sm">Collateral</label>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {collateralOptions.map(o => (
              <Button
                key={o.address}
                onClick={() => setCollateralAsset(o.address)}
                size="md"
              >
                {o.label}
              </Button>
            ))}
          </div>
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
          <Button disabled={isPending || !canStart} onClick={() => lock()} size="lg">
            {someAwaitingSignature ? t("confirmingInWallet") : "Start exit (lock yUSD)"}
          </Button>

          <Button disabled={isPending || !canRedeem} onClick={() => redeem()} size="lg">
            {someAwaitingSignature ? t("confirmingInWallet") : "Submit redeem request"}
          </Button>

          <Button
            disabled={isPending || !canFinalize}
            onClick={() => finalize()}
            size="lg"
          >
            {someAwaitingSignature ? t("confirmingInWallet") : "Finalize"}
          </Button>

          {isWaiting ? (
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
