"use client";

import { AssetInfo } from "@diffuse/config";
import { Dialog, Tabs } from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { BorrowerPosition } from "@/lib/core/types";

import { CancelPosition } from "./CancelPosition";

type ManagePositionModalProps = {
  description?: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  onPositionClosure?: () => void;
  open: boolean;
  selectedAsset: AssetInfo;
  selectedPosition: BorrowerPosition;
  title?: ReactNode;
};

export function ManagePositionModal({
  onOpenChange,
  onPositionClosure,
  open,
  selectedPosition,
  title,
}: ManagePositionModalProps) {
  const t = useTranslations();

  return (
    <Dialog
      onOpenChange={() => {
        onOpenChange(false);
      }}
      open={open}
      size="md"
      title={title}
    >
      <Tabs defaultValue="close">
        <Tabs.List align="start">
          <Tabs.Trigger disabled value="collateral">
            {t("borrow.managePositionModal.collateral")}
          </Tabs.Trigger>
          <Tabs.Trigger disabled value="leverage">
            {t("common.leverage")}
          </Tabs.Trigger>
          <Tabs.Trigger value="close">
            {t("borrow.managePositionModal.closePosition")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content inset value="close">
          <CancelPosition
            onPositionClosure={onPositionClosure}
            selectedPosition={selectedPosition}
          />
        </Tabs.Content>
      </Tabs>
    </Dialog>
  );
}
