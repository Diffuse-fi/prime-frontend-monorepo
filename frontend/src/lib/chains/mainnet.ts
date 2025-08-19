// chains/ethMainnet.ts
import { mainnet } from "wagmi/chains";

export const ethMainnet = {
  ...mainnet,
  iconUrl:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 417"><path fill="#343434" d="M127.9 0l-2.8 9.6v270l2.8 2.8 127.9-75.4z"/><path fill="#8C8C8C" d="M127.9 0L0 207l127.9 75.4V0z"/><path fill="#3C3C3B" d="M127.9 312.7l-1.6 1.9v100.1l1.6 2.3 128-180z"/><path fill="#8C8C8C" d="M127.9 416.9V312.7L0 236z"/></svg>`
    ),
  iconBackground: "#111",
} as const;
