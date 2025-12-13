import { raceSignal as abortable } from "race-signal";
import { Address } from "viem";

import { normalizeError } from "@/errors/normalize";
import { InitReadonly } from "@/types";

import {
  ContractBase,
  GenericContractType,
  getContractInstance,
  SdkRequestOptions,
} from "../shared";
import { viewerAbi } from "./abi";

const contractName = "Viewer";

export class Viewer extends ContractBase {
  private _contract?: GenericContractType<typeof viewerAbi>;

  constructor(init: InitReadonly) {
    super(init);
  }

  async getAssets(vault: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getAssets([vault]), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "getAssets",
      });
    }
  }

  async getStrategies(vault: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getStrategies([vault]), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "getStrategies",
      });
    }
  }

  async getVaults({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getVaults(), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "getVaults",
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
          abi: viewerAbi,
          address: this.getContract().address,
          args: [vault, strategyId, "0x"], // TODO: fix args
          functionName: "previewEnterStrategy",
        }),
        signal
      );
      return sim.result;
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "previewEnterStrategy",
      });
    }
  }

  private getContract() {
    if (!this._contract) {
      this._contract = getContractInstance(this.init, contractName, viewerAbi);
    }
    return this._contract;
  }
}

export { viewerAbi } from "./abi";
