"use client";

import { Button, Dialog } from "@diffuse/ui-kit";
import { cn } from "@diffuse/ui-kit/cn";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Chain } from "viem";
import { useAccount, useChains, useSwitchChain } from "wagmi";

import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { getStableChainMeta } from "@/lib/chains/meta";
import { useReadonlyChainActions } from "@/lib/chains/ReadonlyChainContext";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";

type ChainSwitchModalProps = {
  currentChain?: Chain | null;
  onOpenChange: (open: boolean) => void;
  onSwitched?: (args: { from?: Chain | null; to: Chain }) => void;
  open: boolean;
  title?: React.ReactNode;
};

export function ChainSwitchModal({
  currentChain,
  onOpenChange,
  onSwitched,
  open,
  title = "Switch network",
}: ChainSwitchModalProps) {
  const chains = useChains();
  const { isConnected } = useAccount();
  const { isPending, switchChainAsync, variables } = useSwitchChain();
  const { setReadonlyChainId } = useReadonlyChainActions();
  const t = useTranslations("common.navbar");

  const handleSwitch = async (target: Chain) => {
    if (currentChain && target.id === currentChain.id) {
      onOpenChange(false);
      return;
    }

    if (isConnected) {
      try {
        await switchChainAsync({ chainId: target.id });
        onSwitched?.({ from: currentChain ?? null, to: target });
        onOpenChange(false);
      } catch {}

      return;
    }

    setReadonlyChainId(target.id);
    onSwitched?.({ from: currentChain ?? null, to: target });
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open} size="sm" title={title}>
      <ul className="space-y-2">
        {chains.map(c => {
          const isActive = currentChain?.id === c.id;
          const { iconBackground, iconUrl } = getStableChainMeta(c.id);
          const isThisPending = isPending && variables?.chainId === c.id;

          return (
            <li key={c.id}>
              <Button
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "w-full justify-start gap-3 font-semibold",
                  isActive && "bg-border hover:bg-border"
                )}
                disabled={isActive || isPending}
                onClick={() => !isActive && handleSwitch(c)}
                type="button"
                variant="ghost"
              >
                <ImageWithJazziconFallback
                  alt={c.name}
                  className="rounded-full object-cover"
                  decoding="async"
                  fetchPriority="low"
                  jazziconSeed={stableSeedForChainId(c.id)}
                  size={20}
                  src={iconUrl}
                  style={{ background: iconBackground || "transparent" }}
                />

                <span className="flex-1 text-left">{c.name}</span>

                {isThisPending ? (
                  <Loader2 aria-label="Switching…" className="h-4 w-4 animate-spin" />
                ) : isActive ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{t("connected")}</span>
                    <div aria-hidden className="bg-success size-2 rounded-full" />
                  </div>
                ) : null}
              </Button>
            </li>
          );
        })}
      </ul>
    </Dialog>
  );
}
