import { useUnborrow } from "@/lib/core/hooks/useUnborrow";
import { BorrowerPosition } from "@/lib/core/types";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { toast } from "@/lib/toast";
import { Button, Heading } from "@diffuse/ui-kit";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { SlippageInput } from "../SlippageInput";

interface CancelPositionProps {
  onPositionClosure?: () => void;
  selectedPosition: BorrowerPosition;
}

export function CancelPosition({
  onPositionClosure,
  selectedPosition,
}: CancelPositionProps) {
  const t = useTranslations("borrow.managePositionModal");
  const [slippage, setSlippage] = useLocalStorage(
    "slippage-manage-position-modal",
    "0.1",
    v => ["0.1", "0.5", "1.0"].includes(v)
  );
  const useUnborrowInput = {
    chainId: selectedPosition.vault.contract.chainId,
    address: selectedPosition.vault.address,
    positionId: selectedPosition.id,
    slippage,
    deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
  };
  const {
    unborrow,
    isPending: isUnborrowPending,
    txState,
  } = useUnborrow(useUnborrowInput, selectedPosition.vault, {
    onUnborrowSuccess: () => {
      toast(t("positionClosed"));
      onPositionClosure?.();
    },
    onUnborrowError: e => toast(t("positionClosedError", { error: e })),
  });

  const confirmingInWallet = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 px-5">
          <TriangleAlert className="text-err h-6 w-6 flex-shrink-0" aria-hidden />
          <Heading level="5" className="text-text-dimmed">
            {t("positionClosure")}
          </Heading>
        </div>
        <p className="text-err px-5">
          {t("positionClosureWarning")}
        </p>
        <div className="bg-muted/15 gap-4 rounded-md px-6 py-4">
          <Heading level="5" className="text-text-dimmed">
            {t("estimatedFeesUnavailable")}
          </Heading>
          <p className="text-muted mt-4 text-sm">
            {t("estimatedFeesUnavailable")}
          </p>
        </div>
        <SlippageInput
          className="px-5"
          value={slippage}
          onChange={setSlippage}
          options={[
            { label: "0.1%", value: "0.1" },
            { label: "0.5%", value: "0.5" },
            { label: "1.0%", value: "1.0" },
          ]}
        />
        <Button
          disabled={isUnborrowPending}
          size="lg"
          className="mt-6"
          onClick={() => {
            unborrow();
          }}
        >
          {confirmingInWallet
            ? t("confirmingInWallet")
            : isUnborrowPending
              ? t("closingPosition")
              : t("closePosition")}
        </Button>
      </div>
    </div>
  );
}
