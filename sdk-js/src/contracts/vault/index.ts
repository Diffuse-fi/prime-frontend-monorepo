import { Address, getContract } from "viem";
import { vaultAbi } from "./abi";
import { resolveAddress } from "../../addresses/resolve";
import { Init } from "@/types";
import { normalizeError } from "@/errors/normalize";
import { WalletRequiredError } from "@/errors/errors";
import { ContractBase, GenericContractType, SdkRequestOptions } from "../shared";
import { raceSignal as abortable } from "race-signal";

/** @internal */
type VaultContract = GenericContractType<typeof vaultAbi>;

const contractName = "Vault";

/** @internal */
function _addr(init: Init): Address {
  return resolveAddress({
    chainId: init.chainId,
    contract: contractName,
    addressOverride: init.address,
  });
}

/** @internal */
export function getVaultContract(init: Init): VaultContract {
  const address = _addr(init);

  const client = init.client.wallet
    ? { public: init.client.public, wallet: init.client.wallet }
    : { public: init.client.public };

  return getContract({ address, abi: vaultAbi, client }) as VaultContract;
}

export class Vault extends ContractBase {
  constructor(init: Init) {
    super(init);
  }

  private getContract(): VaultContract {
    return getVaultContract(this.init);
  }

  async getStrategies({ signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.getStrategies(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getStrategies",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getAssets({ signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.getAssets(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getAssets",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async deposit(args: [bigint, Address], { signal }: SdkRequestOptions = {}) {
    if (!this.init.client.wallet) throw new WalletRequiredError("deposit");

    const c = this.getContract();

    try {
      if (!this.init.client.wallet) throw new WalletRequiredError("deposit");

      const sim = await abortable(
        this.init.client.public.simulateContract({
          address: c.address,
          abi: vaultAbi,
          functionName: "deposit",
          args,
          account: this.init.client.wallet.account!,
        }),
        signal
      );

      return await abortable(this.init.client.wallet.writeContract(sim.request), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "deposit",
        args,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async withdraw(args: [bigint, Address, Address], { signal }: SdkRequestOptions = {}) {
    if (!this.init.client.wallet) throw new WalletRequiredError("withdraw");

    const c = this.getContract();

    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          address: c.address,
          abi: vaultAbi,
          functionName: "withdraw",
          args,
          account: this.init.client.wallet.account!,
        }),
        signal
      );

      return await abortable(this.init.client.wallet.writeContract(sim.request), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "withdraw",
        args,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getMaxDeposit(receiver: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.maxDeposit([receiver]), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getMaxDeposit",
        args: [receiver],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getMaxWithdraw(owner: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.maxWithdraw([owner]), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getMaxWithdraw",
        args: [owner],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async totalAssets({ signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.totalAssets(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "totalAssets",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async accruedLenderYield(
    strategiesIds: bigint[],
    owner: Address,
    { signal }: SdkRequestOptions = {}
  ) {
    try {
      return abortable(
        this.getContract().read.accruedLenderYield([strategiesIds, owner]),
        signal
      );
    } catch (e) {
      throw normalizeError(e, {
        op: "accruedLenderYield",
        args: [strategiesIds, owner],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getLenderBalance(owner: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return abortable(this.getContract().read.balanceOf([owner]), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getLenderBalance",
        args: [owner],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }
}
