"use client";

import { getStableChainMeta } from "../../lib/chains/meta";
import { stableSeedForChain } from "@/lib/misc/jazzIcons";
import { toast } from "@/lib/toast";
import { useWalletConnection } from "@/lib/wagmi/useWalletConnection";
import { IconButton } from "@diffuse/ui-kit";
import { Skeleton } from "@diffuse/ui-kit/Skeleton";
import { useCallback, useState } from "react";
import { match, P } from "ts-pattern";
import { useTranslations } from "next-intl";
import { Chain } from "viem";
import { ImageWithJazziconFallback } from "../misc/images/ImageWithJazziconFallback";
import { ChainSwitchModal } from "./ChainSwitchModal";
import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";

export function ChainSwitcher() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("common.navbar");
  const onChainSwitch = useCallback(
    ({ to }: { to: Chain }) => {
      toast(t("toasts.chainSwitch", { chainName: to.name }));
    },
    [t]
  );
  const { isSwitchChainPending, isPendingConnection } = useWalletConnection();
  const { chain } = useReadonlyChain();

  return (
    <>
      <IconButton
        aria-label={`Switch between supported networks. Currently ${
          chain ? chain.name : "Not connected"
        }`}
        aria-busy={isPendingConnection || isSwitchChainPending || undefined}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        disabled={isPendingConnection || isSwitchChainPending}
        variant="ghost"
        size="sm"
        icon={match({
          isPendingConnection,
          isSwitchChainPending,
          chain,
        })
          .with({ isPendingConnection: true }, () => <Skeleton className="h-8 w-8" />)
          .with({ isSwitchChainPending: true }, () => <Skeleton className="h-8 w-8" />)
          .with({ chain: P.select() }, chain => {
            const chainName = chain?.name ?? t("unknownChain");
            const chainId = chain?.id;
            const { iconUrl, iconBackground } = getStableChainMeta(chainId!);

            return (
              <ImageWithJazziconFallback
                src={iconUrl}
                alt={chainName}
                size={20}
                className="rounded-full object-cover"
                style={{
                  background: iconBackground || "transparent",
                }}
                fetchPriority="low"
                decoding="async"
                jazziconSeed={stableSeedForChain(chainId!)}
              />
            );
          })
          .exhaustive()}
      />
      <ChainSwitchModal
        open={open}
        onOpenChange={setOpen}
        currentChain={chain ?? null}
        onSwitched={({ to }) => onChainSwitch({ to })}
        title={t("switchNetworkTitle")}
      />
    </>
  );
}
