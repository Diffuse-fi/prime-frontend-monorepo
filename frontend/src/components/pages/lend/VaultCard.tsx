import { TokenImage } from "@/components/TokenImage";
import { VaultWithAddress } from "@/lib/core/types";
import { useVault } from "@/lib/core/useVault";
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
} from "@diffuse/ui-kit";
import { useState } from "react";

type VaultProps = {
  vault: VaultWithAddress;
};

export function VaultCard({ vault }: VaultProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { vaultFull } = useVault({ vault });
  const { dict } = useLocalization();
  const headerText = `${vault.name}. ${formatAprPercent(vault?.targetApr).text}`;

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
        tokenSymbol="mUSDC"
        renderTokenImage={() => (
          <TokenImage
            imgURI=""
            alt=""
            address={vaultFull?.assets?.at(0)?.address ?? ""}
          />
        )}
      />
      <ControlledCollapsible
        summary="List of strategies"
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      >
        {vaultFull?.strategies?.map(s => (
          <div key={s.apr}>
            {formatAprPercent(s.apr).text} APR, until&nbsp;
            {formatDate(s.endDate).text}
          </div>
        ))}
      </ControlledCollapsible>
    </Card>
  );
}
