"use client";

import { useVaults } from "../../../lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { AssetsList } from "@/components/AssetsList";
import { Heading } from "@diffuse/ui-kit";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useState } from "react";
import { BorrowModal } from "./BorrowModal";
import { BorrowCard } from "./BorrowCard";
import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";
import { VaultFullInfo } from "@/lib/core/types";
import { useAccount } from "wagmi";

export default function Borrow() {
  const [modalOpen, setModalOpen] = useState(false);
  const { chain } = useReadonlyChain();
  const { isLoading, vaultsAssetsList, vaults } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const [selectedVault, setSelectedVault] = useState<VaultFullInfo | null>(null);
  const { dir } = useLocalization();
  const { isConnected } = useAccount();
  const strategies = vaults
    .filter(v => v.assets?.some(a => a.address === selectedAsset?.address))
    .flatMap(v => v.strategies)
    .map(strategy => ({
      ...strategy,
      vault: vaults.find(v => v.strategies.some(s => s.id === strategy.id))!,
    }));

  return (
    <div className="mt-9 flex flex-col gap-3 md:gap-8">
      <div className="row-start-1 flex flex-col gap-3">
        <Heading level="5">Filter by asset</Heading>
        <AssetsList
          onSelectAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
          isLoading={isLoading}
          options={vaultsAssetsList}
          direction={dir}
          className="w-fit"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {selectedAsset && !!chain
          ? strategies.map(strategy => (
              <BorrowCard
                key={strategy.id}
                strategy={strategy}
                selectedAsset={selectedAsset!}
                onBorrow={() => {
                  setSelectedVault(strategy.vault);
                  setModalOpen(true);
                }}
                chain={chain}
                isConnected={isConnected}
              />
            ))
          : null}
      </div>
      {selectedAsset !== null && selectedVault !== null && (
        <BorrowModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          selectedAsset={selectedAsset}
          selectedVault={selectedVault}
        />
      )}
    </div>
  );
}
