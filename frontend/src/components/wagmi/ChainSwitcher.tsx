"use client";

import { getStableChainMeta } from "../../lib/chains/meta";
import { stableSeedForChain } from "@/lib/misc/jazzIcons";
import { toast } from "@/lib/toast";
import { useWalletConnection } from "@/lib/wagmi/useWalletConnection";
import { IconButton } from "@diffuse/ui-kit";
import { Skeleton } from "@diffuse/ui-kit/Skeleton";
import { useChainModal } from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { match, P } from "ts-pattern";

const Jazzicon = dynamic(() => import("react-jazzicon"), { ssr: false });

export function ChainSwitcher() {
  const [broken, setBroken] = useState(false);
  const { openChainModal } = useChainModal();
  const onChainSwitch = useCallback(
    ({ from, to }: { from: number | null; to: number }) => {
      toast(`Network: ${from ?? "?"} → ${to}`);
    },
    []
  );
  const { isSwitchChainPending, isPendingConnection, isConnected, chain } =
    useWalletConnection({
      onChainSwitch,
    });

  return (
    <IconButton
      aria-label="Switch between supported networks"
      onClick={openChainModal}
      disabled={!isConnected || isPendingConnection || isSwitchChainPending}
      variant="ghost"
      className="animate-in-fade"
      size="sm"
      icon={match({
        isConnected,
        isPendingConnection,
        isSwitchChainPending,
        chain,
      })
        .with({ isConnected: false }, () => null)
        .with({ isPendingConnection: true }, () => <Skeleton className="h-8 w-8" />)
        .with({ isSwitchChainPending: true }, () => <Skeleton className="h-8 w-8" />)
        .with({ isConnected: true, chain: P.select() }, chain => {
          const chainName = chain?.name ?? "Unknown chain";
          const chainId = chain?.id;
          const { iconUrl, iconBackground } = getStableChainMeta(chainId!);
          const chainHasNormalIcon = !!iconUrl && typeof iconUrl === "string" && !broken;

          if (!chainHasNormalIcon) {
            const seed = stableSeedForChain(chainId!);
            return <Jazzicon diameter={20} seed={seed} />;
          }

          return (
            <Image
              src={iconUrl}
              alt={chainName}
              width={20}
              height={20}
              style={{
                background: iconBackground || "transparent",
              }}
              fetchPriority="low"
              decoding="async"
              className="rounded-full object-cover"
              onError={() => setBroken(true)}
            />
          );
        })
        .exhaustive()}
    />
  );
}
