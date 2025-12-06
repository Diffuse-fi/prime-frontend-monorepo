import { Address } from "viem";
import { viewerAbi } from "./abi";
import { InitReadonly } from "@/types";
import { normalizeError } from "@/errors/normalize";
import {
  ContractBase,
  GenericContractType,
  getContractInstance,
  SdkRequestOptions,
} from "../shared";
import { raceSignal as abortable } from "race-signal";

const contractName = "Viewer";

export class Viewer extends ContractBase {
  constructor(init: InitReadonly) {
    super(init);
  }

  private _contract?: GenericContractType<typeof viewerAbi>;

  private getContract() {
    if (!this._contract) {
      this._contract = getContractInstance(this.init, contractName, viewerAbi);
    }
    return this._contract;
  }

  async getVaults({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getVaults(), signal);
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
      return await abortable(this.getContract().read.getAssets([vault]), signal);
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

  async previewEnterStrategy(
    vault: Address,
    strategyId: bigint,
    { signal }: SdkRequestOptions = {}
  ) {
    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          address: this.getContract().address,
          abi: viewerAbi,
          functionName: "previewEnterStrategy",
          args: [vault, strategyId, "0x"], // TODO: fix args
        }),
        signal
      );
      return sim.result;
    } catch (e) {
      throw normalizeError(e, {
        op: "previewEnterStrategy",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }
}

export { viewerAbi };
