"use client";

import { TokenImage } from "../../shared/TokenImage";
import { VaultFullInfo } from "../../../lib/core/types";
import { formatDate } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { useLocalization } from "@/lib/localization/useLocalization";
import {
  Badge,
  Card,
  Heading,
  SimpleTable,
  Text,
  TokenInput,
  TokenInputProps,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { TokenInfo } from "@/lib/tokens/validations";
import { calcAprInterest } from "@/lib/formulas";
import { formatUnits } from "@/lib/formatters/token";
import { RisksNotice } from "./RisksNotice";

type VaultProps = {
  vault: VaultFullInfo;
  selectedAsset: TokenInfo;
  amount?: bigint;
  onAmountChange?: TokenInputProps["onValueChange"];
};

export function VaultCard({ vault, amount, onAmountChange, selectedAsset }: VaultProps) {
  const { dict } = useLocalization();
  const vaultAprFormatted = formatAprToPercent(vault.targetApr);
  const defaultLockupPerdiod = 90; // TODO - get real value from the vault data when ready
  const headerText = `${vault.name}. ${vaultAprFormatted.text} (${defaultLockupPerdiod}-day lockup)`;
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
      header={
        <div className="flex items-center justify-start gap-1">
          <Badge variant="dot" color="primary" />
          <Heading level={4} className="font-bold">
            {headerText}
          </Heading>
        </div>
      }
    >
      <Text className="font-bold">{dict.lend.deposit}</Text>
      <TokenInput
        placeholder="0.0"
        value={amount ? formatUnits(amount, selectedAsset.decimals).text : ""}
        onValueChange={onAmountChange}
        tokenSymbol="mUSDC"
        renderTokenImage={() => (
          <TokenImage alt="" address={vault?.assets?.at(0)!.address} />
        )}
      />
      <SimpleTable
        aria-label="Vault rewards based on input amount and target APR"
        density="compact"
        columns={["Rewards type", "APR", "Reward"]}
        rows={[
          [
            <div key="d" className="flex items-center">
              <TokenImage
                alt=""
                address={vault?.assets?.at(0)!.address}
                className="mr-1"
                size={20}
              />
              Target APY
            </div>,
            vaultAprFormatted.text,
            rewardDisplay,
          ],
        ]}
      />
      <UncontrolledCollapsible summary="List of strategies" defaultOpen={false}>
        {vault?.strategies?.map(s => (
          <div key={s.apr}>
            {formatAprToPercent(s.apr).text} APR, until&nbsp;
            {formatDate(s.endDate).text}
          </div>
        ))}
      </UncontrolledCollapsible>
      <UncontrolledCollapsible summary="Risks" defaultOpen={false}>
        <RisksNotice risks={dict.lend.risks} />
      </UncontrolledCollapsible>
    </Card>
  );
}
