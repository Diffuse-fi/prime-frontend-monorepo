"use client";

import { useBorrowerPositions } from "@/lib/core/hooks/useBorrowerPositions";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { showSkeletons } from "@/lib/misc/ui";
import { Heading } from "@diffuse/ui-kit";

export function BorrowPositions() {
  const {
    vaults,
    vaultsAssetsList,
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
  } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const { positions, isLoading, isPending } =
    useBorrowerPositions(vaultsForSelectedAsset);

  return (
    <div className="mt-4 flex flex-col gap-3 md:gap-8">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
        {isLoading || isPending || isPendingVaults || isLoadingVaults ? (
          showSkeletons(2, "h-40 sm:h-80")
        ) : positions.length > 0 ? (
          positions.map(position => <></>)
        ) : (
          <div className="sm:col-span-3">
            <Heading level="5" className="pt-2 font-semibold">
              No positions yet
            </Heading>
            <p className="">
              You have no borrower positions yet. Start by borrowing assets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
