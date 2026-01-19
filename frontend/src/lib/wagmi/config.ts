import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { env } from "@/env";
import { transportsWithInjectedRpcOverrides } from "@/lib/chains/transportsWithInjectedRpcOverrides";

import { getAvailableChains } from "../chains";

const chains = getAvailableChains();
const transports = transportsWithInjectedRpcOverrides(chains);

export const config = getDefaultConfig({
  appDescription: env.NEXT_PUBLIC_APP_DESCRIPTION,
  appIcon: "/logo.svg?v=1",
  appName: env.NEXT_PUBLIC_APP_NAME,
  chains,
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  ssr: true,
  transports,
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        trustWallet,
        walletConnectWallet,
        safeWallet,
      ],
    },
  ],
});
