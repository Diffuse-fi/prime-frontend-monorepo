"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AssetInfo } from "@/lib/assets/validations";
import { Dialog } from "@diffuse/ui-kit";

type ChainSwitchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  selectedAsset: AssetInfo;
};

export function BorrowModal({
  open,
  onOpenChange,
  selectedAsset,
}: ChainSwitchModalProps) {
  const t = useTranslations("borrow.borrowModal");
  const title = t("title", { assetSymbol: selectedAsset.symbol });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} size="sm"></Dialog>
  );
}
