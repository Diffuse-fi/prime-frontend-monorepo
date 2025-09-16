"use client";

import { Button, IconButton } from "@diffuse/ui-kit";
import { ConnectButton as ConnectButtonComponent } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

function DesktopConnectButton({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <Button size="sm" onClick={onClick} type="button">
      <Wallet className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
}

function MobileConnectButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      size="sm"
      onClick={onClick}
      icon={<Wallet size={20} />}
      aria-label="Connect wallet"
    />
  );
}

export default function ConnectButton() {
  const t = useTranslations("common");

  return (
    <ConnectButtonComponent.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            <div className="hidden md:block">
              <DesktopConnectButton
                onClick={!connected ? openConnectModal : openAccountModal}
                text={!connected ? t("navbar.walletConect") : account.displayName}
              />
            </div>
            <div className="md:hidden">
              <MobileConnectButton
                onClick={!connected ? openConnectModal : openAccountModal}
              />
            </div>
          </div>
        );
      }}
    </ConnectButtonComponent.Custom>
  );
}
