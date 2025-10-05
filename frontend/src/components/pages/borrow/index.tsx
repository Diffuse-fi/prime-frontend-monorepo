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
import { Strategy, VaultFullInfo } from "@/lib/core/types";
import { useAccount } from "wagmi";
import { useBorrowActivationWatcher } from "@/lib/core/hooks/useBorrowActivationWatcher";
import { toast } from "@/lib/toast";
import { usePendingBorrowerPositionIds } from "@/lib/core/hooks/useBorrowerPendingPositions";

export type SelectedStartegy = {
  vault: VaultFullInfo;
} & Strategy;

export default function Borrow() {
  const [modalOpen, setModalOpen] = useState(false);
  const { chain } = useReadonlyChain();
  const { isLoading, vaultsAssetsList, vaults } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const [selectedStrategy, setSelectedStrategy] = useState<SelectedStartegy | null>(null);
  const { dir } = useLocalization();
  const { isConnected, address } = useAccount();
  const [pendingRequests, setPendingRequests] = useState<bigint[]>([]);
  const { pending, refetch: refetchPendingRequests } =
    usePendingBorrowerPositionIds(vaults);
  const strategies = vaults
    .filter(v => v.assets?.some(a => a.address === selectedAsset?.address))
    .flatMap(v => v.strategies)
    .filter(str => !str.isDisabled)
    .map(strategy => ({
      ...strategy,
      vault: vaults.find(v => v.strategies.some(s => s.id === strategy.id))!,
    }));
  useBorrowActivationWatcher({
    vaultAddresses: vaults.map(v => v.address),
    enabled: isConnected && !!pendingRequests.length,
    chainId: chain?.id,
    account: address,
    onActivated: ({ strategyId }) => {
      setPendingRequests(prev => prev.filter(id => id !== strategyId));
      const strategyName = strategies.find(s => s.id === strategyId)?.name;
      toast(`Your borrow request for strategy "${strategyName}" has been activated!`);
      refetchPendingRequests();
    },
  });

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
      <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {selectedAsset && !!chain
          ? strategies.map(strategy => (
              <BorrowCard
                key={strategy.id}
                strategy={strategy}
                selectedAsset={selectedAsset!}
                onBorrow={() => {
                  setSelectedStrategy(strategy);
                  setModalOpen(true);
                }}
                chain={chain}
                isConnected={isConnected}
                isBorrowRequestPending={
                  pendingRequests.includes(strategy.id) ||
                  !!pending.find(
                    p =>
                      p.vault.address === strategy.vault.address &&
                      p.positionIds.includes(strategy.id)
                  )
                }
              />
            ))
          : null}
      </div>
      {selectedAsset !== null && selectedStrategy !== null && (
        <BorrowModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          selectedAsset={selectedAsset}
          selectedStrategy={selectedStrategy}
          onBorrowRequestSuccess={() => {
            setSelectedStrategy(null);
            setModalOpen(false);
            setPendingRequests(prev => [...prev, selectedStrategy.id]);
            refetchPendingRequests();
          }}
        />
      )}
    </div>
  );
}
