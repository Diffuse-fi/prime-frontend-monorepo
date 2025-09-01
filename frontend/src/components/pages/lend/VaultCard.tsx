import { TokenImage } from "@/components/TokenImage";
import { VaultFullInfo } from "../../../lib/core/types";
import { formatDate } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { useLocalization } from "@/lib/localization/useLocalization";
import {
  Badge,
  Card,
  ControlledCollapsible,
  Heading,
  Text,
  TokenInput,
  TokenInputProps,
} from "@diffuse/ui-kit";
import { useState } from "react";
import { TokenInfo } from "@/lib/tokens/validations";
import { calcAprInterest } from "@/lib/formulas";
import { formatToken, formatUnits } from "@/lib/formatters/token";
import { formatThousandsSpace } from "@/lib/formatters/number";

type VaultProps = {
  vault: VaultFullInfo;
  selectedAsset: TokenInfo;
  amount?: bigint;
  onAmountChange?: TokenInputProps["onValueChange"];
};

export function VaultCard({ vault, amount, onAmountChange, selectedAsset }: VaultProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
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
  const rewardDisplay = reward
    ? `${reward} ${selectedAsset.symbol} (${vaultAprFormatted.text} APR)`
    : "";

  return (
    <Card
      header={
        <div className="flex justify-start items-center gap-1">
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
          <TokenImage imgURI="" alt="" address={vault?.assets?.at(0)?.address ?? ""} />
        )}
      />
      <Text className="mt-2">{`${dict.lend.rewards}: ${rewardDisplay}`}</Text>
      <ControlledCollapsible
        summary="List of strategies"
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      >
        {vault?.strategies?.map(s => (
          <div key={s.apr}>
            {formatAprToPercent(s.apr).text} APR, until&nbsp;
            {formatDate(s.endDate).text}
          </div>
        ))}
      </ControlledCollapsible>
    </Card>
  );
}
