import { raceSignal as abortable } from "race-signal";
import { Address } from "viem";

import { WalletRequiredError } from "@/errors/errors";
import { normalizeError } from "@/errors/normalize";
import { Init } from "@/types";

import { applySlippageBpsArray } from "../../slippage";
import { getEvent } from "../events";
import {
  ContractBase,
  GenericContractType,
  getContractInstance,
  SdkRequestOptions,
} from "../shared";
import { vaultAbi } from "./abi";

const contractName = "Vault";
const EV_BORROWER_POSITION_ACTIVATED = getEvent(
  vaultAbi,
  "BorrowerPositionActivated",
  contractName
);

export class Vault extends ContractBase {
  private _contract?: GenericContractType<typeof vaultAbi>;

  constructor(init: Init) {
    super(init);
  }

  async accruedLenderYield(
    strategiesIds: bigint[],
    owner: Address,
    { signal }: SdkRequestOptions = {}
  ) {
    try {
      return await abortable(
        this.getContract().read.accruedLenderYield([strategiesIds, owner]),
        signal
      );
    } catch (error) {
      throw normalizeError(error, {
        args: [strategiesIds, owner],
        chainId: this.chainId,
        contract: contractName,
        op: "accruedLenderYield",
      });
    }
  }

  async borrowRequest(
    [
      strategyId,
      collateralType,
      collateralAmount,
      assetsToBorrow,
      liquidationPrice,
      minAssetsOut,
      deadline,
    ]: [
      bigint,
      number,
      bigint,
      bigint,
      bigint,
      bigint[],
      bigint,
    ],
    { signal }: SdkRequestOptions = {}
  ) {
    if (!this.init.client.wallet) throw new WalletRequiredError("borrowRequest");

    const c = this.getContract();

    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          abi: vaultAbi,
          account: this.init.client.wallet.account!,
          address: c.address,
          args: [
            strategyId,
            collateralType,
            collateralAmount,
            assetsToBorrow,
            liquidationPrice,
            minAssetsOut,
            deadline,
          ],
          functionName: "borrowRequest",
        }),
        signal
      );

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (error) {
      throw normalizeError(error, {
        args: [
          strategyId,
          collateralType,
          collateralAmount,
          assetsToBorrow,
          liquidationPrice,
          minAssetsOut,
          deadline,
        ],
        chainId: this.chainId,
        contract: contractName,
        op: "borrowRequest",
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
          abi: vaultAbi,
          account: this.init.client.wallet.account!,
          address: c.address,
          args,
          functionName: "deposit",
        }),
        signal
      );

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (error) {
      throw normalizeError(error, {
        args,
        chainId: this.chainId,
        contract: contractName,
        op: "deposit",
      });
    }
  }

  async getActiveBorrowerPositions(owner: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(
        this.getContract().read.getActiveBorrowerPositions([owner]),
        signal
      );
    } catch (error) {
      throw normalizeError(error, {
        args: [owner],
        chainId: this.chainId,
        contract: contractName,
        op: "getActiveBorrowerPositions",
      });
    }
  }

  async getAvailableLiquidity({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.availableLiquidity(), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "availableLiquidity",
      });
    }
  }

  async getCurator({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getCurator(), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "getCurator",
      });
    }
  }

  async getLenderBalance(owner: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.balanceOf([owner]), signal);
    } catch (error) {
      throw normalizeError(error, {
        args: [owner],
        chainId: this.chainId,
        contract: contractName,
        op: "getLenderBalance",
      });
    }
  }

  async getMaxDeposit(receiver: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.maxDeposit([receiver]), signal);
    } catch (error) {
      throw normalizeError(error, {
        args: [receiver],
        chainId: this.chainId,
        contract: contractName,
        op: "getMaxDeposit",
      });
    }
  }

  async getMaxWithdraw(owner: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.maxWithdraw([owner]), signal);
    } catch (error) {
      throw normalizeError(error, {
        args: [owner],
        chainId: this.chainId,
        contract: contractName,
        op: "getMaxWithdraw",
      });
    }
  }

  async getPendingBorrowerPositionIds(
    owner: Address,
    { signal }: SdkRequestOptions = {}
  ) {
    try {
      return await abortable(
        this.getContract().read.getPendingBorrowerPositionIds([owner]),
        signal
      );
    } catch (error) {
      throw normalizeError(error, {
        args: [owner],
        chainId: this.chainId,
        contract: contractName,
        op: "getPendingBorrowerPositionIds",
      });
    }
  }

  async getSpreadFee({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getSpreadFee(), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "getSpreadFee",
      });
    }
  }

  async getStrategylength({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getStrategyLength(), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "getStrategylength",
      });
    }
  }

  async previewBorrow(
    [
      forUser,
      strategyId,
      collateralType,
      collateralAmount,
      assetsToBorrow,
    ]: [
      Address,
      bigint,
      number,
      bigint,
      bigint,
    ],
    { signal }: SdkRequestOptions = {}
  ) {
    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          abi: vaultAbi,
          address: this.getContract().address,
          args: [
            forUser,
            strategyId,
            collateralType,
            collateralAmount,
            assetsToBorrow,
            "0x",
          ], // TODO: fix args
          functionName: "previewBorrow",
        }),
        signal
      );

      return sim.result;
    } catch (error) {
      throw normalizeError(error, {
        args: [forUser, strategyId, collateralType, collateralAmount, assetsToBorrow],
        chainId: this.chainId,
        contract: contractName,
        op: "previewBorrow",
      });
    }
  }

  async totalAssets({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.totalAssets(), signal);
    } catch (error) {
      throw normalizeError(error, {
        chainId: this.chainId,
        contract: contractName,
        op: "totalAssets",
      });
    }
  }

  async unborrow(
    [
      positionId,
      deadline,
      slippage,
    ]: [
      bigint,
      bigint,
      bigint,
    ],
    { signal }: SdkRequestOptions = {}
  ) {
    if (!this.init.client.wallet) throw new WalletRequiredError("unborrow");

    try {
      const minAssetsOutForPreview = [0n];
      const sim = await abortable(
        this.init.client.public.simulateContract({
          abi: vaultAbi,
          account: this.init.client.wallet.account!,
          address: this.getContract().address,
          args: [positionId, minAssetsOutForPreview, deadline, "0x"], // TODO: fix args
          functionName: "unborrow",
        }),
        signal
      );

      const [returned] = sim.result;
      const adjustedMinAssetsOut = applySlippageBpsArray(returned, slippage, "down");

      const gas =
        sim.request.gas ??
        (await this.init.client.public.estimateContractGas({
          abi: vaultAbi,
          account: this.init.client.wallet.account!,
          address: this.getContract().address,
          args: [positionId, adjustedMinAssetsOut, deadline, "0x"], // TODO: fix args
          functionName: "unborrow",
        }));

      const gasAdj = (gas * 12n) / 10n;

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract({
        ...sim.request,
        args: [positionId, adjustedMinAssetsOut, deadline, "0x"], // TODO: fix args
        gas: gasAdj,
      });
    } catch (error) {
      throw normalizeError(error, {
        args: [positionId, deadline, slippage],
        chainId: this.chainId,
        contract: contractName,
        op: "previewUnborrow",
      });
    }
  }

  async withdraw(args: [bigint, Address, Address], { signal }: SdkRequestOptions = {}) {
    if (!this.init.client.wallet) throw new WalletRequiredError("withdraw");

    const c = this.getContract();

    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          abi: vaultAbi,
          account: this.init.client.wallet.account!,
          address: c.address,
          args,
          functionName: "withdraw",
        }),
        signal
      );

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (error) {
      throw normalizeError(error, {
        args,
        chainId: this.chainId,
        contract: contractName,
        op: "withdraw",
      });
    }
  }

  async withdrawYield(
    [
      strategyIds,
      user,
    ]: [
      bigint[],
      Address,
    ],
    { signal }: SdkRequestOptions = {}
  ) {
    if (!this.init.client.wallet) throw new WalletRequiredError("withdrawYield");

    const c = this.getContract();

    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          abi: vaultAbi,
          account: this.init.client.wallet.account!,
          address: c.address,
          args: [strategyIds, user],
          functionName: "withdrawYield",
        }),
        signal
      );

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (error) {
      throw normalizeError(error, {
        args: [strategyIds],
        chainId: this.chainId,
        contract: contractName,
        op: "withdrawYield",
      });
    }
  }

  private getContract() {
    if (!this._contract) {
      this._contract = getContractInstance(this.init, contractName, vaultAbi);
    }
    return this._contract;
  }
}

export { EV_BORROWER_POSITION_ACTIVATED };

export { vaultAbi } from "./abi";
