import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import {
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getAvailableChains } from "../chains";
import { env } from "@/env";

export const config = getDefaultConfig({
  appName: env.NEXT_PUBLIC_APP_NAME,
  appIcon: "/logo.svg?v=1",
  appDescription: env.NEXT_PUBLIC_APP_DESCRIPTION,
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: getAvailableChains(),
  transports: {
    ...getAvailableChains().reduce(
      (acc, chain) => {
        acc[chain.id] = http();
        return acc;
      },
      {} as Record<number, ReturnType<typeof http>>
    ),
  },
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
