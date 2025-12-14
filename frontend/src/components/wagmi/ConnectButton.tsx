"use client";

import { Button, IconButton } from "@diffuse/ui-kit";
import { ConnectButton as ConnectButtonComponent } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { trackEvent } from "@/lib/analytics";

import { DesktopOnly, MobileOnly } from "../misc/viewports";

export default function ConnectButton() {
  const t = useTranslations("common");

  return (
    <ConnectButtonComponent.Custom>
      {({ account, chain, mounted, openAccountModal, openConnectModal }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        const handleOpenAccountModal = () => {
          trackEvent("wallet_account_modal_open");
          openAccountModal();
        };

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
                aria-haspopup="dialog"
                aria-label={
                  connected
                    ? `Account settings for ${account.displayName}`
                    : t("navbar.walletConnect")
                }
                onClick={connected ? handleOpenAccountModal : openConnectModal}
                size="sm"
                type="button"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {connected ? account.displayName : t("navbar.walletConnect")}
              </Button>
            </DesktopOnly>
            <MobileOnly>
              <IconButton
                aria-haspopup="dialog"
                aria-label={
                  connected
                    ? `Account settings for ${account.displayName}`
                    : t("navbar.walletConnect")
                }
                icon={<Wallet size={20} />}
                onClick={connected ? handleOpenAccountModal : openConnectModal}
                size="sm"
                type="button"
              />
            </MobileOnly>
          </div>
        );
      }}
    </ConnectButtonComponent.Custom>
  );
}
