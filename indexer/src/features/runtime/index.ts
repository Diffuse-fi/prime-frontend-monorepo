import { Chain, type PublicClient, type Address, createPublicClient, http } from "viem";
import { Viewer, Vault } from "@diffuse/sdk-js";

export type VaultRuntime = {
  chain: Chain;
  publicClient: PublicClient;
  viewer: Viewer;
  vaultAddress: Address;
  vault: Vault;
};

export class ChainRuntime {
  chain: Chain;
  publicClient: PublicClient;
  viewer: Viewer;
  startBlock: bigint;

  constructor(chain: Chain, rpcUrl: string, startBlock: bigint) {
    this.chain = chain;
    this.startBlock = startBlock;

    this.publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
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
        chainId: this.chain.id,
        client: { public: this.publicClient },
        address: v.vault,
      });

      return {
        chain: this.chain,
        publicClient: this.publicClient,
        viewer: this.viewer,
        vaultAddress: v.vault,
        vault,
      };
    });
  }
}
