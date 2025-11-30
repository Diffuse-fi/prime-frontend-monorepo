"use client";

import { AssetInfo } from "@/lib/assets/validations";
import { BorrowerPosition } from "@/lib/core/types";
import { Dialog, Tabs } from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { CancelPosition } from "./CancelPosition";

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
  const t = useTranslations("borrow.managePositionModal");
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
            {t("collateral")}
          </Tabs.Trigger>
          <Tabs.Trigger value="leverage" disabled>
            {t("leverage")}
          </Tabs.Trigger>
          <Tabs.Trigger value="close">{t("closePosition")}</Tabs.Trigger>
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
