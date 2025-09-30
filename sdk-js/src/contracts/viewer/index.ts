import { Address, getContract } from "viem";
import { viewerAbi } from "./abi";
import { resolveAddress } from "../../addresses/resolve";
import { InitReadonly } from "@/types";
import { normalizeError } from "@/errors/normalize";
import { ContractBase, GenericContractType, SdkRequestOptions } from "../shared";
import { raceSignal as abortable } from "race-signal";

/** @internal */
type ViewerContract = GenericContractType<typeof viewerAbi>;

const contractName = "Viewer";

/** @internal */
function _addr(init: InitReadonly): Address {
  return resolveAddress({
    chainId: init.chainId,
    contract: contractName,
    addressOverride: init.address,
  });
}

/** @internal */
export function getViewerContract(init: InitReadonly): ViewerContract {
  const address = _addr(init);

  const client = { public: init.client.public };

  return getContract({ address, abi: viewerAbi, client }) as ViewerContract;
}

export class Viewer extends ContractBase {
  constructor(init: InitReadonly) {
    super(init);
  }

  private getContract() {
    return getViewerContract(this.init);
  }

  async getVaults({ signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.getVaults(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getVaults",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getAssets(vault: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.getAssets([vault]), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getAssets",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getStrategies(vault: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getStrategies([vault]), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getStrategies",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }
}

export { viewerAbi };
