"use client";

import { useLocalization } from "@/lib/localization/useLocalization";
import { Button } from "@diffuse/ui-kit";
import { ConnectButton as ConnectButtonComponent } from "@rainbow-me/rainbowkit";

export default function ConnectButton() {
  const { dict } = useLocalization();

  return (
    <ConnectButtonComponent.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            className="animate-in-fade"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            <Button
              size="sm"
              onClick={!connected ? openConnectModal : openAccountModal}
              type="button"
            >
              {!connected ? dict.common.navbar.walletConect : account.displayName}
            </Button>
          </div>
        );
      }}
    </ConnectButtonComponent.Custom>
  );
}
