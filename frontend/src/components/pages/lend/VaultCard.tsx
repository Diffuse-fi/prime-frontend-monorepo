"use client";

import { AssetInfo } from "@diffuse/config";
import {
  AssetInput,
  AssetInputProps,
  Badge,
  Card,
  FormField,
  Heading,
  SimpleTable,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { getVaultRiskLevelColor } from "@/lib/core/utils/vault";
import { formatUnits } from "@/lib/formatters/asset";
import { isPast } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";

import { VaultFullInfo } from "../../../lib/core/types";
import { RisksNotice } from "./RisksNotice";
import { StrategiesList } from "./StrategiesList";

type VaultProps = {
  amount?: bigint;
  isConnected?: boolean;
  onAmountChange?: AssetInputProps["onValueChange"];
  selectedAsset: AssetInfo;
  vault: VaultFullInfo;
};

export function VaultCard({
  amount,
  isConnected,
  onAmountChange,
  selectedAsset,
  vault,
}: VaultProps) {
  const t = useTranslations("lend");
  const tCommon = useTranslations("common");
  const vaultAprFormatted = formatAprToPercent(vault.targetApr);

  return (
    <Card
      cardBodyClassName="gap-4"
      header={
        <div className="flex items-center justify-start gap-4">
          <Badge className="ml-2" color={getVaultRiskLevelColor(vault.riskLevel)} />
          <div className="flex items-center gap-4">
            <Heading className="font-semibold" level="4">
              {vault.name}&#65343;
            </Heading>
            <span className="text-secondary text-lg">{vaultAprFormatted.text}</span>
          </div>
        </div>
      }
    >
      <div className="flex gap-4">
        <FormField className="grow" label={t("deposit")}>
          <AssetInput
            assetSymbol={selectedAsset?.symbol}
            disabled={!isConnected}
            onValueChange={onAmountChange}
            placeholder="0.0"
            renderAssetImage={() => (
              <AssetImage
                address={vault?.assets?.at(0)!.address}
                alt=""
                imgURI={vault?.assets?.at(0)!.logoURI}
                size={24}
              />
            )}
            value={amount ? formatUnits(amount, selectedAsset?.decimals).text : ""}
          />
        </FormField>
      </div>
      <SimpleTable
        aria-label={t("ariaLabels.vaultRewards")}
        columns={[
          t("rewardsType"),
          <div className="text-right font-mono text-xs" key="key">
            {tCommon("apr")}
          </div>,
        ]}
        density="comfy"
        rows={[
          [
            <div className="flex items-center" key="1">
              <AssetImage
                address={vault?.assets?.at(0)!.address}
                alt=""
                className="mr-1"
                imgURI={vault?.assets?.at(0)!.logoURI}
                size={20}
              />
              {t("targetApy")}
            </div>,
            <div className="text-right" key="2">
              {vaultAprFormatted.text}
            </div>,
          ],
        ]}
      />
      <div className="flex flex-col gap-2">
        <UncontrolledCollapsible defaultOpen={false} summary={t("listOfStrategies")}>
          <StrategiesList strategies={vault.strategies.filter(s => !isPast(s.endDate))} />
        </UncontrolledCollapsible>
        <UncontrolledCollapsible
          defaultOpen={false}
          summary={t("risks.title")}
          summaryClassName="text-err"
        >
          <RisksNotice />
        </UncontrolledCollapsible>
      </div>
    </Card>
  );
}
