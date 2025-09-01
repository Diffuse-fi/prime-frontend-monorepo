import { TokenImage } from "@/components/TokenImage";
import { VaultFullInfo } from "../../../lib/core/types";
import { formatDate } from "@/lib/formatters/date";
import { formatAprPercent } from "@/lib/formatters/finance";
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
import { formatThousandsSpace } from "@/lib/formatters/number";

type VaultProps = {
  vault: VaultFullInfo;
  selectedAsset: TokenInfo;
  amount?: string;
  onAmountChange?: TokenInputProps["onValueChange"];
};

export function VaultCard({ vault, amount, onAmountChange, selectedAsset }: VaultProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { dict } = useLocalization();
  const vaultAprFormatted = formatAprPercent(vault.targetApr);
  const defaultLockupPerdiod = 90; // TODO - get real value from the vault data when ready
  const headerText = `${vault.name}. ${vaultAprFormatted.text} (${defaultLockupPerdiod}-day lockup)`;
  const reward = amount
    ? calcAprInterest(BigInt(amount), vault.targetApr, {
        durationInDays: defaultLockupPerdiod,
      })
    : 0n;
  const rewardDisplay =
    reward === 0n
      ? ""
      : `${formatThousandsSpace(reward).text} ${selectedAsset.symbol} (${vaultAprFormatted.text} APR)`;

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
        value={amount}
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
            {formatAprPercent(s.apr).text} APR, until&nbsp;
            {formatDate(s.endDate).text}
          </div>
        ))}
      </ControlledCollapsible>
    </Card>
  );
}
