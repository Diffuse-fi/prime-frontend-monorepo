import { useUnborrow } from "@/lib/core/hooks/useUnborrow";
import { BorrowerPosition } from "@/lib/core/types";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { toast } from "@/lib/toast";
import { Button, Heading } from "@diffuse/ui-kit";
import { TriangleAlert } from "lucide-react";
import { SlippageInput } from "../SlippageInput";

interface CancelPositionProps {
  onCancelPosition?: () => void;
  selectedPosition: BorrowerPosition;
}

export function CancelPosition({
  onCancelPosition,
  selectedPosition,
}: CancelPositionProps) {
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
      toast("Borrow position closed");
      onCancelPosition?.();
    },
    onUnborrowError: () => toast("Error closing borrow position"),
  });
  const errors = Object.values(txState)
    .map(x => x.errorMessage)
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 px-5">
          <TriangleAlert className="text-err h-6 w-6 flex-shrink-0" aria-hidden />
          <Heading level="5" className="text-text-dimmed">
            Position closure
          </Heading>
        </div>
        <p className="text-err px-5">
          This action will close your entire position and cannot be undone. Please review
          the details carefully before proceeding.
        </p>
        <div className="bg-muted/15 gap-4 rounded-md px-6 py-4">
          <Heading level="5" className="text-text-dimmed">
            Estimated fees are currently unavailable. Please proceed with caution.
          </Heading>
          <p className="text-muted mt-4 text-sm">
            Estimated fees are currently unavailable. Please proceed with caution.
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
          {isUnborrowPending ? "Closing position..." : "Close position"}
        </Button>
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
  );
}
