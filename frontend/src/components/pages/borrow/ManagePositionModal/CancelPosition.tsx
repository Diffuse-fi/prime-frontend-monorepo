import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useUnborrow } from "@/lib/core/hooks/useUnborrow";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { BorrowerPosition } from "@/lib/core/types";
import { useLocalStorage } from "@/lib/misc/useLocalStorage";
import { toast } from "@/lib/toast";
import { Button, Heading, UncontrolledCollapsible } from "@diffuse/ui-kit";
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
  const { vaults, vaultsAssetsList } = useVaults();
  const [selectedAsset] = useSelectedAsset(vaultsAssetsList);
  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const [slippage, setSlippage] = useLocalStorage(
    "slippage-manage-position-modal",
    "0.1",
    v => ["0.1", "0.5", "1.0"].includes(v)
  );
  const { unborrow, isPending: isUnborrowPending } = useUnborrow(vaultsForSelectedAsset, {
    onSuccess: () => {
      toast("Borrow position closed");
      onCancelPosition?.();
    },
    onError: () => toast("Error closing borrow position"),
  });

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
            Estimated fees
          </Heading>
          <p className="text-muted mt-4 text-sm">No data</p>
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
          onClick={() => {
            unborrow({
              vaultAddress: selectedPosition.vault.address,
              positionId: selectedPosition.id,
              deadline: 1000n,
            });
          }}
        >
          Close Position
        </Button>
      </div>
    </div>
  );
}
