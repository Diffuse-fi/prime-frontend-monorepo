"use client";

import { Heading } from "@diffuse/ui-kit";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount } from "wagmi";

import { AssetsList } from "@/components/AssetsList";
import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";
import { useBorrowerPositions } from "@/lib/core/hooks/useBorrowerPositions";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useLocalization } from "@/lib/localization/useLocalization";

import { useVaults } from "../../../lib/core/hooks/useVaults";
import { BorrowCard } from "./BorrowCard";
import { BorrowModal } from "./BorrowModal";
import { SelectedStartegy } from "./types";

export default function Borrow() {
  const { chain } = useReadonlyChain();
  const { isLoading, refetch, vaults, vaultsAssetsList } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const [selectedStrategy, setSelectedStrategy] = useState<null | SelectedStartegy>(null);
  const { dir } = useLocalization();
  const { isConnected } = useAccount();
  const { refetchPending } = useBorrowerPositions(vaults);
  const strategies = vaults
    .filter(v => v.assets?.some(a => a.address === selectedAsset?.address))
    .flatMap(v => v.strategies)
    .filter(str => !str.isDisabled)
    .map(strategy => ({
      ...strategy,
      vault: vaults.find(v => v.strategies.some(s => s.id === strategy.id))!,
    }));
  const { openConnectModal } = useConnectModal();

  return (
    <div className="mt-9 flex flex-col gap-3 md:gap-8">
      <div className="row-start-1 flex flex-col gap-3">
        <Heading level="5">Filter by asset</Heading>
        <AssetsList
          className="w-fit"
          direction={dir}
          isLoading={isLoading}
          onSelectAsset={setSelectedAsset}
          options={vaultsAssetsList}
          selectedAsset={selectedAsset}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {selectedAsset && !!chain
          ? strategies.map(strategy => (
              <BorrowCard
                chain={chain}
                isConnected={isConnected}
                key={strategy.id}
                onBorrow={() => {
                  setSelectedStrategy(strategy);
                }}
                onConnectWallet={openConnectModal}
                selectedAsset={selectedAsset!}
                strategy={strategy}
                vault={strategy.vault}
              />
            ))
          : null}
      </div>
      {selectedAsset !== null && selectedStrategy !== null && (
        <BorrowModal
          onBorrowRequestSuccess={() => {
            setSelectedStrategy(null);
            refetch();
            refetchPending();
          }}
          onOpenChange={open => {
            if (!open) {
              setSelectedStrategy(null);
            }
          }}
          open={selectedStrategy !== null}
          selectedAsset={selectedAsset}
          selectedStrategy={selectedStrategy}
        />
      )}
    </div>
  );
}
