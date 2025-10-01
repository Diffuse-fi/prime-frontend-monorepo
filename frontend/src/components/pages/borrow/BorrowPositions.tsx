"use client";

import { AssetsList } from "@/components/AssetsList";
import { useBorrowerPositions } from "@/lib/core/hooks/useBorrowerPositions";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { showSkeletons } from "@/lib/misc/ui";
import { Heading } from "@diffuse/ui-kit";
import { BorrowerPositionCard } from "./BorrowPositionCard";

export function BorrowPositions() {
  const {
    vaults,
    vaultsAssetsList,
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
  } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const { dir } = useLocalization();

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const { positions, isLoading, isPending } =
    useBorrowerPositions(vaultsForSelectedAsset);

  return (
    <div className="mt-4 flex flex-col gap-3 md:gap-8">
      <AssetsList
        skeletonsToShow={1}
        options={vaultsAssetsList}
        direction={dir}
        selectedAsset={selectedAsset}
        onSelectAsset={setSelectedAsset}
        isLoading={isLoadingVaults}
        className="w-1/2"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
        {isLoading || isPending || isPendingVaults || isLoadingVaults ? (
          showSkeletons(2, "h-40 sm:h-80")
        ) : positions.length > 0 ? (
          positions.map(position => (
            <BorrowerPositionCard
              key={position.strategyId.toString()}
              position={position}
            />
          ))
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
