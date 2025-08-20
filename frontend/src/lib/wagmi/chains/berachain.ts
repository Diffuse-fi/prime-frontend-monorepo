import { Chain } from "wagmi/chains";

export const berachain = {
  id: 80069,
  name: "Berachain",
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
