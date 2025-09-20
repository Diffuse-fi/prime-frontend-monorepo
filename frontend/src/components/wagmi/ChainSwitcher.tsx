"use client";

import { getStableChainMeta } from "../../lib/chains/meta";
import { stableSeedForChain } from "@/lib/misc/jazzIcons";
import { toast } from "@/lib/toast";
import { useWalletConnection } from "@/lib/wagmi/useWalletConnection";
import { IconButton, Tooltip } from "@diffuse/ui-kit";
import { Skeleton } from "@diffuse/ui-kit/Skeleton";
import { Ban } from "lucide-react";
import { useCallback, useState } from "react";
import { match, P } from "ts-pattern";
import { useTranslations } from "next-intl";
import { Chain } from "viem";
import { ImageWithJazziconFallback } from "../misc/images/ImageWithJazziconFallback";
import { ChainSwitchModal } from "./ChainSwitchModal";

export function ChainSwitcher() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("common");
  const onChainSwitch = useCallback(
    ({ to }: { to: Chain }) => {
      toast(t("navbar.toasts.chainSwitch", { chainName: to.name }));
    },
    [t]
  );
  const { isSwitchChainPending, isPendingConnection, isConnected, chain } =
    useWalletConnection({
      onChainSwitch,
    });

  return (
    <>
      <IconButton
        aria-label={`Switch between supported networks. Currently ${
          chain ? chain.name : "Not connected"
        }`}
        aria-busy={isPendingConnection || isSwitchChainPending || undefined}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        disabled={!isConnected || isPendingConnection || isSwitchChainPending}
        variant="ghost"
        size="sm"
        icon={match({
          isConnected,
          isPendingConnection,
          isSwitchChainPending,
          chain,
        })
          .with({ isConnected: false }, () => (
            <Tooltip content={t("navbar.needToConnect")}>
              <Ban />
            </Tooltip>
          ))
          .with({ isPendingConnection: true }, () => <Skeleton className="h-8 w-8" />)
          .with({ isSwitchChainPending: true }, () => <Skeleton className="h-8 w-8" />)
          .with({ isConnected: true, chain: P.select() }, chain => {
            const chainName = chain?.name ?? t("navbar.unknownChain");
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
        title={t("navbar.switchNetworkTitle")}
      />
    </>
  );
}
