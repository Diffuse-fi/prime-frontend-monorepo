"use client";

import { IconButton } from "@diffuse/ui-kit";
import { Skeleton } from "@diffuse/ui-kit/Skeleton";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { match, P } from "ts-pattern";
import { Chain } from "viem";
import { useConnect, useSwitchChain } from "wagmi";

import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import { toast } from "@/lib/toast";

import { getStableChainMeta } from "../../lib/chains/meta";
import { ImageWithJazziconFallback } from "../misc/images/ImageWithJazziconFallback";
import { ChainSwitchModal } from "./ChainSwitchModal";

export function ChainSwitcher() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("common.navbar");
  const onChainSwitch = useCallback(
    ({ to }: { to: Chain }) => {
      toast(t("toasts.chainSwitch", { chainName: to.name }));
    },
    [t]
  );
  const { isPending } = useSwitchChain();
  const { isPending: isPendingConnection } = useConnect();
  const { chain } = useReadonlyChain();

  return (
    <>
      <IconButton
        aria-busy={isPendingConnection || isPending || undefined}
        aria-haspopup="dialog"
        aria-label={`Switch between supported networks. Currently ${
          chain ? chain.name : "Not connected"
        }`}
        disabled={isPendingConnection || isPending}
        icon={match({
          chain,
          isPending,
          isPendingConnection,
        })
          .with({ isPendingConnection: true }, () => <Skeleton className="h-8 w-8" />)
          .with({ isPending: true }, () => <Skeleton className="h-8 w-8" />)
          .with({ chain: P.select() }, chain => {
            const chainName = chain?.name ?? t("unknownChain");
            const chainId = chain?.id;
            const { iconBackground, iconUrl } = getStableChainMeta(chainId!);

            return (
              <ImageWithJazziconFallback
                alt={chainName}
                className="rounded-full object-cover"
                decoding="async"
                fetchPriority="low"
                jazziconSeed={stableSeedForChainId(chainId!)}
                size={20}
                src={iconUrl}
                style={{
                  background: iconBackground || "transparent",
                }}
              />
            );
          })
          .exhaustive()}
        onClick={() => setOpen(true)}
        size="sm"
        variant="ghost"
      />
      <ChainSwitchModal
        currentChain={chain ?? null}
        onOpenChange={setOpen}
        onSwitched={({ to }) => onChainSwitch({ to })}
        open={open}
        title={t("switchNetworkTitle")}
      />
    </>
  );
}
