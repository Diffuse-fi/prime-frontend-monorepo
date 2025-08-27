import { Address, getContract } from "viem";
import { vaultRegistryAbi } from "./abi";
import { resolveAddress } from "../../addresses/resolve";
import { Init } from "@/types";
import { normalizeViemError } from "@/errors/normalize";
import { ContractBase, GenericContractType } from "../shared";

/** @internal */
type VaultRegistryContract = GenericContractType<typeof vaultRegistryAbi>;

const contractName = "VaultRegistry";

/** @internal */
function _addr(init: Init): Address {
  return resolveAddress({
    chainId: init.chainId,
    contract: contractName,
    addressOverride: init.address,
  });
}

/** @internal */
export function getVaultRegistryContract(init: Init): VaultRegistryContract {
  const address = _addr(init);

  const client = init.client.wallet
    ? { public: init.client.public, wallet: init.client.wallet }
    : { public: init.client.public };

  return getContract({ address, abi: vaultRegistryAbi, client }) as VaultRegistryContract;
}

export class VaultRegistry extends ContractBase {
  constructor(init: Init) {
    super(init);
  }

  private getContract() {
    return getVaultRegistryContract(this.init);
  }

  async getVaults() {
    try {
      return this.getContract().read.getVaults();
    } catch (e) {
      throw normalizeViemError(e, {
        op: "getVaults",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }
}
