"use client";

import * as React from "react";
import { Button, Dialog } from "@diffuse/ui-kit";
import { Loader2 } from "lucide-react";
import { Chain } from "viem";
import { useAccount, useChains, useSwitchChain } from "wagmi";
import { cn } from "@diffuse/ui-kit/cn";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { getStableChainMeta } from "@/lib/chains/meta";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import { useTranslations } from "next-intl";
import { useReadonlyChainActions } from "@/lib/chains/ReadonlyChainContext";

type ChainSwitchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentChain?: Chain | null;
  onSwitched?: (args: { from?: Chain | null; to: Chain }) => void;
  title?: React.ReactNode;
};

export function ChainSwitchModal({
  open,
  onOpenChange,
  currentChain,
  onSwitched,
  title = "Switch network",
}: ChainSwitchModalProps) {
  const chains = useChains();
  const { isConnected } = useAccount();
  const { switchChainAsync, isPending, variables } = useSwitchChain();
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
    <Dialog open={open} onOpenChange={onOpenChange} title={title} size="sm">
      <ul className="space-y-2">
        {chains.map(c => {
          const isActive = currentChain?.id === c.id;
          const { iconUrl, iconBackground } = getStableChainMeta(c.id);
          const isThisPending = isPending && variables?.chainId === c.id;

          return (
            <li key={c.id}>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-semibold",
                  isActive && "bg-border hover:bg-border"
                )}
                onClick={() => !isActive && handleSwitch(c)}
                disabled={isActive || isPending}
                aria-current={isActive ? "true" : undefined}
              >
                <ImageWithJazziconFallback
                  src={iconUrl}
                  alt={c.name}
                  size={20}
                  className="rounded-full object-cover"
                  style={{ background: iconBackground || "transparent" }}
                  jazziconSeed={stableSeedForChainId(c.id)}
                  decoding="async"
                  fetchPriority="low"
                />

                <span className="flex-1 text-left">{c.name}</span>

                {isThisPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-label="Switching…" />
                ) : isActive ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{t("connected")}</span>
                    <div className="bg-success size-2 rounded-full" aria-hidden />
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
