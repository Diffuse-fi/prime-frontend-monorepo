import { Viewer } from "@diffuse/sdk-js";
import { createPublicClient, http } from "viem";
import { chains } from "../config/chains";

const viewers = new Map<number, Viewer>(
  chains.map(chain => {
    const rpc = process.env.RPC_URL!;
    const publicClient = createPublicClient({ chain, transport: http(rpc) });

    const viewer = new Viewer({
      chainId: chain.id,
      client: {
        public: publicClient,
      },
    });
    return [chain.id, viewer];
  })
);

export function getViewerForChainId(chainId: number) {
  const viewer = viewers.get(chainId);

  if (!viewer) {
    throw new Error(`Viewer not configured for chainId ${chainId}`);
  }

  return viewer;
}
