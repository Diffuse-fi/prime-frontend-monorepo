import { AssetInfo } from "@/lib/assets/validations";
import { BorrowerPosition } from "@/lib/core/types";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { Dialog } from "@diffuse/ui-kit";
import { ReactNode } from "react";

type ManagePositionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: React.ReactNode;
  selectedAsset: AssetInfo;
  selectedPosition: BorrowerPosition;
  onBorrowRequestSuccess?: () => void;
};

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

export function ManagePositionModal({
  open,
  onOpenChange,
  title,
}: ManagePositionModalProps) {
  const [slippage, setSlippage] = useLocalStorage(
    "slippage-manage-position-modal",
    "0.1",
    v => ["0.1", "0.5", "1.0"].includes(v)
  );

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
      }}
      title={title}
      size="lg"
    ></Dialog>
  );
}
