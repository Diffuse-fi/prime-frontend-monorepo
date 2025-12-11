import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { fallback } from "viem";
import { http } from "wagmi";

import { env } from "@/env";

import { getAvailableChains } from "../chains";
import { customRpcMap } from "../chains/rpc";

const chains = getAvailableChains();
const transports = Object.fromEntries(
  chains.map(chain => [
    chain.id,
    fallback([
      ...(customRpcMap[chain.id] ?? []).map(url => http(url)),
      ...chain.rpcUrls.default.http.map(url => http(url)),
    ]),
  ])
);

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
