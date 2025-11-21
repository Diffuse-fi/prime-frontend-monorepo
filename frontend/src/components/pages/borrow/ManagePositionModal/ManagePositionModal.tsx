"use client";

import { AssetInfo } from "@/lib/assets/validations";
import { BorrowerPosition } from "@/lib/core/types";
import { Dialog, Tabs } from "@diffuse/ui-kit";
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
            Collateral
          </Tabs.Trigger>
          <Tabs.Trigger value="leverage" disabled>
            Leverage
          </Tabs.Trigger>
          <Tabs.Trigger value="close">Close Position</Tabs.Trigger>
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
