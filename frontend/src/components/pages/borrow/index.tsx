"use client";

import { useVaults } from "../../../lib/core/hooks/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { useTranslations } from "next-intl";
import { AssetsList } from "@/components/AssetsList";
import { Heading } from "@diffuse/ui-kit";
import { useSelectedAsset } from "@/lib/core/hooks/useSelectedAsset";
import { useState } from "react";
import { BorrowModal } from "./BorrowModal";

export default function Borrow() {
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoading, vaultsAssetsList } = useVaults();
  const [selectedAsset, setSelectedAsset] = useSelectedAsset(vaultsAssetsList);
  const { dir } = useLocalization();
  const t = useTranslations("lend");

  return (
    <div className="mt-9 flex flex-col gap-3 md:gap-6">
      <div className="row-start-1 flex flex-col gap-3">
        <Heading level="5">{t("assetsToLend")}</Heading>
        <AssetsList
          onSelectAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
          isLoading={isLoading}
          options={vaultsAssetsList}
          direction={dir}
          className="w-fit"
        />
      </div>
      {selectedAsset !== null && (
        <BorrowModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          selectedAsset={selectedAsset}
        />
      )}
    </div>
  );
}
