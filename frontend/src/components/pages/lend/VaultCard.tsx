"use client";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { VaultFullInfo } from "../../../lib/core/types";
import { formatAprToPercent } from "@/lib/formatters/finance";
import {
  Badge,
  Card,
  Heading,
  SimpleTable,
  AssetInput,
  AssetInputProps,
  UncontrolledCollapsible,
  FormField,
} from "@diffuse/ui-kit";
import { AssetInfo } from "@/lib/assets/validations";
import { calcAprInterest } from "@/lib/formulas/apr";
import { formatUnits } from "@/lib/formatters/asset";
import { RisksNotice } from "./RisksNotice";
import { getVaultRiskLevelColor } from "@/lib/core/utils/vault";
import { useTranslations } from "next-intl";
import { StrategiesList } from "./StrategiesList";

type VaultProps = {
  vault: VaultFullInfo;
  selectedAsset: AssetInfo;
  amount?: bigint;
  onAmountChange?: AssetInputProps["onValueChange"];
  isConnected?: boolean;
};

export function VaultCard({
  vault,
  amount,
  onAmountChange,
  selectedAsset,
  isConnected,
}: VaultProps) {
  const t = useTranslations("lend");
  const vaultAprFormatted = formatAprToPercent(vault.targetApr);
  const defaultLockupPerdiod = 90; // TODO - get real value from the vault data when ready
  const reward = amount
    ? formatUnits(
        calcAprInterest(vault.targetApr, amount, {
          durationInDays: defaultLockupPerdiod,
        }),
        selectedAsset.decimals
      ).text
    : "";
  const rewardDisplay = reward ? `${reward} ${selectedAsset.symbol}` : "-";

  return (
    <Card
      cardBodyClassName="gap-4"
      header={
        <div className="flex items-center justify-start gap-4">
          <Badge color={getVaultRiskLevelColor(vault.riskLevel)} className="ml-2" />
          <div className="flex items-center gap-4">
            <Heading level="4" className="font-semibold">
              {vault.name}&#65343;
            </Heading>
            <span className="text-secondary text-lg">{vaultAprFormatted.text}</span>
          </div>
        </div>
      }
    >
      <div className="flex gap-4">
        <FormField label={t("deposit")} className="grow">
          <AssetInput
            disabled={!isConnected}
            placeholder="0.0"
            value={amount ? formatUnits(amount, selectedAsset?.decimals).text : ""}
            onValueChange={onAmountChange}
            assetSymbol={selectedAsset?.symbol}
            renderAssetImage={() => (
              <AssetImage alt="" address={vault?.assets?.at(0)!.address} size={24} />
            )}
          />
        </FormField>
      </div>
      <SimpleTable
        aria-label="Vault rewards based on input amount and target APR"
        density="comfy"
        columns={[
          "Rewards type",
          <div key="key" className="text-right font-mono text-xs">
            APR
          </div>,
          <div key="key" className="text-right font-mono text-xs">
            Reward
          </div>,
        ]}
        rows={[
          [
            <div key="1" className="flex items-center">
              <AssetImage
                alt=""
                address={vault?.assets?.at(0)!.address}
                className="mr-1"
                size={20}
              />
              Target APY
            </div>,
            <div key="2" className="text-right">
              {vaultAprFormatted.text}
            </div>,
            <div key="3" className="text-right">
              {rewardDisplay}
            </div>,
          ],
        ]}
      />
      <div className="flex flex-col gap-2">
        <UncontrolledCollapsible summary="List of strategies" defaultOpen={false}>
          <StrategiesList strategies={vault.strategies} />
        </UncontrolledCollapsible>
        <UncontrolledCollapsible
          summary="Risks"
          defaultOpen={false}
          summaryClassName="text-err"
        >
          <RisksNotice />
        </UncontrolledCollapsible>
      </div>
    </Card>
  );
}
