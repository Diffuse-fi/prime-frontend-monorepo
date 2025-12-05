import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";
import {
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
  safeWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getAvailableChains } from "../chains";
import { env } from "@/env";

const chains = getAvailableChains();
const transports = chains.map(chain =>
  fallback([
    http(chain.rpcUrls.default.http[0]),
  ])
);

export const config = getDefaultConfig({
  appName: env.NEXT_PUBLIC_APP_NAME,
  appIcon: "/logo.svg?v=1",
  appDescription: env.NEXT_PUBLIC_APP_DESCRIPTION,
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains,
  transports,
  ssr: true,
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
