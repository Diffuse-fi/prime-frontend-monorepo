import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, berachain } from "wagmi/chains";
import { http } from "wagmi";
import {
  metaMaskWallet,
  trustWallet,
  injectedWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME!,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [berachain] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [berachain.id]: http(),
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
    {
      groupName: "Other",
      wallets: [injectedWallet],
    },
  ],
});
