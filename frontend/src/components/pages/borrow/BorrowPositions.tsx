"use client";

import { AssetsList } from "@/components/AssetsList";
import { useBorrowerPositions } from "@/lib/core/hooks/useBorrowerPositions";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { showSkeletons } from "@/lib/misc/ui";
import { Heading } from "@diffuse/ui-kit";
import { BorrowerPositionCard } from "./BorrowPositionCard";
import { BorrowerPosition } from "@/lib/core/types";
import { useState } from "react";
import { ManagePositionModal } from "./ManagePositionModal/ManagePositionModal";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { AppLink } from "@/components/misc/AppLink";
import { ExternalLink } from "lucide-react";
import { formatEvmAddress } from "@/lib/formatters/asset";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import { useChainId } from "wagmi";
import { getStableChainMeta } from "@/lib/chains/meta";
import { getContractExplorerUrl } from "@/lib/chains/rpc";

export function BorrowPositions() {
  const {
    vaults,
    vaultsAssetsList,
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
    refetchLimits,
    refetchTotalAssets,
    refetch,
  } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const [selectedPosition, setSelectedPosition] = useState<BorrowerPosition>();
  const { dir } = useLocalization();
  const strategies = vaults.flatMap(v => v.strategies);
  const chainId = useChainId();
  const { iconUrl, iconBackground } = getStableChainMeta(chainId);
  const explorerUrl = selectedPosition
    ? getContractExplorerUrl(chainId, selectedPosition.vault.address)
    : "";

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const {
    positions,
    isLoading,
    isPending,
    refetchPositions: refetchBorrowerPositions,
  } = useBorrowerPositions(vaultsForSelectedAsset);

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
        {isLoading ||
        isPending ||
        isPendingVaults ||
        isLoadingVaults ||
        !selectedAsset ? (
          showSkeletons(2, "h-40 sm:h-80")
        ) : positions.length > 0 ? (
          positions.map(position => {
            const strategy = strategies.find(s => s.id === position.strategyId);

            if (!strategy) return null;

            return (
              <BorrowerPositionCard
                key={position.id}
                position={position}
                onManagePositionBtnClick={() => setSelectedPosition(position)}
                selectedAsset={selectedAsset}
                strategy={strategy}
              />
            );
          })
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
      {selectedPosition && selectedAsset && (
        <ManagePositionModal
          selectedPosition={selectedPosition}
          selectedAsset={selectedAsset}
          open={!!selectedPosition}
          onOpenChange={open => {
            if (!open) {
              setSelectedPosition(undefined);
            }
          }}
          onPositionClosure={() => {
            refetchLimits();
            refetchTotalAssets();
            refetchBorrowerPositions();
            setSelectedPosition(undefined);
            refetch();
          }}
          title={
            <div className="flex items-center justify-between gap-4">
              <Heading level="3" className="font-semibold">
                Manage position
              </Heading>
              <div className="bg-muted/15 ml-auto flex size-8 items-center justify-center rounded-full">
                <ImageWithJazziconFallback
                  src={iconUrl}
                  alt=""
                  size={20}
                  className="object-cover"
                  style={{
                    background: iconBackground || "transparent",
                  }}
                  fetchPriority="low"
                  decoding="async"
                  jazziconSeed={stableSeedForChainId(chainId)}
                />
              </div>
              {explorerUrl && (
                <AppLink
                  href={explorerUrl}
                  className="text-text-dimmed bg-muted/15 hover:bg-muted/20 flex h-8 items-center gap-3 rounded-md p-2 text-sm text-nowrap transition-colors"
                >
                  {formatEvmAddress(selectedPosition.vault.address)}
                  <ExternalLink size={20} className="" />
                </AppLink>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
