// chains/berachainBepolia.ts
import { Chain } from "wagmi/chains";

export const berachainBepolia = {
  id: 80069,
  name: "Berachain Bepolia",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bepolia.rpc.berachain.com"] },
    public: { http: ["https://bepolia.rpc.berachain.com"] },
  },
  blockExplorers: {
    default: { name: "Beratrail", url: "https://bepolia.beratrail.io" },
    alternate: { name: "BeraScan", url: "https://testnet.berascan.com" },
  },
} as const satisfies Chain;
