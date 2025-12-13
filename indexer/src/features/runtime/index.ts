import { Vault, Viewer } from "@diffuse/sdk-js";
import {
  type Address,
  Chain,
  createPublicClient,
  fallback,
  http,
  type PublicClient,
} from "viem";

export type VaultRuntime = {
  chain: Chain;
  publicClient: PublicClient;
  vault: Vault;
  vaultAddress: Address;
  viewer: Viewer;
};

export class ChainRuntime {
  chain: Chain;
  publicClient: PublicClient;
  startBlock: bigint;
  viewer: Viewer;

  constructor(chain: Chain, rpcUrls: string[], startBlock: bigint) {
    this.chain = chain;
    this.startBlock = startBlock;

    this.publicClient = createPublicClient({
      chain,
      transport: fallback(rpcUrls.map(url => http(url))),
    });

    this.viewer = new Viewer({
      chainId: chain.id,
      client: { public: this.publicClient },
    });
  }

  async getVaultRuntimes(): Promise<VaultRuntime[]> {
    const allVaults = await this.viewer.getVaults();

    return allVaults.map(v => {
      const vault = new Vault({
        address: v.vault,
        chainId: this.chain.id,
        client: { public: this.publicClient },
      });

      return {
        chain: this.chain,
        publicClient: this.publicClient,
        vault,
        vaultAddress: v.vault,
        viewer: this.viewer,
      };
    });
  }
}
