"use client";

import { Heading } from "@diffuse/ui-kit";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { useChainId } from "wagmi";

import { AssetsList } from "@/components/AssetsList";
import { AppLink } from "@/components/misc/AppLink";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { getStableChainMeta } from "@/lib/chains/meta";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { useBorrowerPositions } from "@/lib/core/hooks/useBorrowerPositions";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { BorrowerPosition } from "@/lib/core/types";
import { formatEvmAddress } from "@/lib/formatters/asset";
import { useLocalization } from "@/lib/localization/useLocalization";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import { showSkeletons } from "@/lib/misc/ui";

import { BorrowerPositionCard } from "./BorrowPositionCard";
import { ManagePositionModal } from "./ManagePositionModal/ManagePositionModal";

export function BorrowPositions() {
  const {
    isLoading: isLoadingVaults,
    isPending: isPendingVaults,
    refetch,
    refetchLimits,
    refetchTotalAssets,
    vaults,
    vaultsAssetsList,
  } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const [selectedPosition, setSelectedPosition] = useState<BorrowerPosition>();
  const { dir } = useLocalization();
  const strategies = vaults.flatMap(v => v.strategies);
  const chainId = useChainId();
  const { iconBackground, iconUrl } = getStableChainMeta(chainId);
  const explorerUrl = selectedPosition
    ? getContractExplorerUrl(chainId, selectedPosition.vault.address)
    : "";

  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const {
    isLoading,
    isPending,
    positions,
    refetchPositions: refetchBorrowerPositions,
  } = useBorrowerPositions(vaultsForSelectedAsset);

  return (
    <div className="mt-4 flex flex-col gap-3 md:gap-8">
      <AssetsList
        className="w-1/2"
        direction={dir}
        isLoading={isLoadingVaults}
        onSelectAsset={setSelectedAsset}
        options={vaultsAssetsList}
        selectedAsset={selectedAsset}
        skeletonsToShow={1}
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
                onManagePositionBtnClick={() => setSelectedPosition(position)}
                position={position}
                selectedAsset={selectedAsset}
                strategy={strategy}
              />
            );
          })
        ) : (
          <div className="sm:col-span-3">
            <Heading className="pt-2 font-semibold" level="5">
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
          open={!!selectedPosition}
          selectedAsset={selectedAsset}
          selectedPosition={selectedPosition}
          title={
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <Heading className="font-semibold" level="3">
                Manage position
              </Heading>
              <div className="bg-muted/15 ml-auto flex size-8 items-center justify-center rounded-full">
                <ImageWithJazziconFallback
                  alt=""
                  className="object-cover"
                  decoding="async"
                  fetchPriority="low"
                  jazziconSeed={stableSeedForChainId(chainId)}
                  size={20}
                  src={iconUrl}
                  style={{
                    background: iconBackground || "transparent",
                  }}
                />
              </div>
              {explorerUrl && (
                <AppLink
                  className="text-text-dimmed bg-muted/15 hover:bg-muted/20 flex h-8 items-center gap-3 rounded-md p-2 text-sm text-nowrap transition-colors"
                  href={explorerUrl}
                >
                  <div className="hidden sm:block">
                    {formatEvmAddress(selectedPosition.vault.address)}
                  </div>
                  <ExternalLink size={20} />
                </AppLink>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
