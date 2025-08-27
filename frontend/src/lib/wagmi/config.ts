import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import {
  metaMaskWallet,
  // trustWallet,
  // walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getAvailableChains } from "./chains";

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
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
        // trustWallet,
        // walletConnectWallet,
      ],
    },
  ],
});
