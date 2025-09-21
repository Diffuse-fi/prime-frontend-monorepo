import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";
import {
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getAvailableChains } from "../chains";
import { env } from "@/env";
import { getChainRpcUrls } from "../chains/rpc";

const chains = getAvailableChains();
const transports = Object.fromEntries(
  chains.map(c => {
    const urls = getChainRpcUrls(c.id);

    if (urls.length === 0) {
      throw new Error(`No RPC URLs configured for chain ${c.name} (${c.id})`);
    }

    return [
      c.id,
      urls.length > 1
        ? fallback(
            urls.map(u => http(u)),
            { rank: true, retryCount: 1 }
          )
        : http(urls[0]),
    ];
  })
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
      ],
    },
  ],
});
