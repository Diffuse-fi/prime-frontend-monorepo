"use client";

import { Button, IconButton } from "@diffuse/ui-kit";
import { ConnectButton as ConnectButtonComponent } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { DesktopOnly, MobileOnly } from "../misc/viewports";

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
            <DesktopOnly displayClassName="md:inline-flex">
              <Button
                size="sm"
                onClick={!connected ? openConnectModal : openAccountModal}
                type="button"
                aria-label={
                  !connected
                    ? t("navbar.walletConect")
                    : `Account settings for ${account.displayName}`
                }
              >
                <Wallet className="mr-2 h-4 w-4" />
                {!connected ? t("navbar.walletConect") : account.displayName}
              </Button>
            </DesktopOnly>
            <MobileOnly>
              <IconButton
                size="sm"
                onClick={!connected ? openConnectModal : openAccountModal}
                icon={<Wallet size={20} />}
                aria-label={
                  !connected
                    ? t("navbar.walletConect")
                    : `Account settings for ${account.displayName}`
                }
              />
            </MobileOnly>
          </div>
        );
      }}
    </ConnectButtonComponent.Custom>
  );
}
