"use client";

import { BorrowerPosition } from "@/lib/core/types";
import { Dialog, Tabs } from "@diffuse/ui-kit";
import { ReactNode } from "react";
import { CancelPosition } from "./CancelPosition";
import { AssetInfo } from "@diffuse/config";
import { useTranslations } from "next-intl";

type ManagePositionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: React.ReactNode;
  selectedAsset: AssetInfo;
  selectedPosition: BorrowerPosition;
  onPositionClosure?: () => void;
};

export function ManagePositionModal({
  open,
  onOpenChange,
  title,
  onPositionClosure,
  selectedPosition,
}: ManagePositionModalProps) {
  const t = useTranslations();

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
      }}
      title={title}
      size="md"
    >
      <Tabs defaultValue="close">
        <Tabs.List align="start">
          <Tabs.Trigger value="collateral" disabled>
            {t("borrow.managePositionModal.collateral")}
          </Tabs.Trigger>
          <Tabs.Trigger value="leverage" disabled>
            {t("common.leverage")}
          </Tabs.Trigger>
          <Tabs.Trigger value="close">
            {t("borrow.managePositionModal.closePosition")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="close" inset>
          <CancelPosition
            onPositionClosure={onPositionClosure}
            selectedPosition={selectedPosition}
          />
        </Tabs.Content>
      </Tabs>
    </Dialog>
  );
}
