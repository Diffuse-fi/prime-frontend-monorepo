import { Address } from "viem";
import { vaultAbi } from "./abi";
import { Init } from "@/types";
import { normalizeError } from "@/errors/normalize";
import { WalletRequiredError } from "@/errors/errors";
import { ContractBase, getContractInstance, SdkRequestOptions } from "../shared";
import { raceSignal as abortable } from "race-signal";
import { getEvent } from "../events";

const contractName = "Vault";
const EV_BORROWER_POSITION_ACTIVATED = getEvent(vaultAbi, "BorrowerPositionActivated");

export class Vault extends ContractBase {
  constructor(init: Init) {
    super(init);
  }

  private _contract = getContractInstance(this.init, contractName, vaultAbi);

  getContract() {
    return this._contract;
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

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
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

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
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
      return await abortable(this.getContract().read.maxDeposit([receiver]), signal);
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
      return await abortable(this.getContract().read.maxWithdraw([owner]), signal);
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
      return await abortable(this.getContract().read.totalAssets(), signal);
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
      return await abortable(
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
      return await abortable(this.getContract().read.balanceOf([owner]), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getLenderBalance",
        args: [owner],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getActiveBorrowerPositions(owner: Address, { signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(
        this.getContract().read.getActiveBorrowerPositions([owner]),
        signal
      );
    } catch (e) {
      throw normalizeError(e, {
        op: "getActiveBorrowerPositions",
        args: [owner],
        contract: contractName,
        chainId: this.chainId,
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
      minStrategyToReceive,
      deadline,
    ]: [
      bigint,
      number,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
    ],
    { signal }: SdkRequestOptions = {}
  ) {
    if (!this.init.client.wallet) throw new WalletRequiredError("borrowRequest");

    const c = this.getContract();

    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          address: c.address,
          abi: vaultAbi,
          functionName: "borrowRequest",
          args: [
            strategyId,
            collateralType,
            collateralAmount,
            assetsToBorrow,
            liquidationPrice,
            minStrategyToReceive,
            deadline,
          ],
          account: this.init.client.wallet.account!,
        }),
        signal
      );

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (e) {
      throw normalizeError(e, {
        op: "borrowRequest",
        args: [
          strategyId,
          collateralType,
          collateralAmount,
          assetsToBorrow,
          liquidationPrice,
          minStrategyToReceive,
          deadline,
        ],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getStrategylength({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getStrategyLength(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getStrategylength",
        contract: contractName,
        chainId: this.chainId,
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
    } catch (e) {
      throw normalizeError(e, {
        op: "getPendingBorrowerPositionIds",
        args: [owner],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getSpreadFee({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getSpreadFee(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getSpreadFee",
        contract: contractName,
        chainId: this.chainId,
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
          address: this.getContract().address,
          abi: vaultAbi,
          functionName: "previewBorrow",
          args: [forUser, strategyId, collateralType, collateralAmount, assetsToBorrow],
        }),
        signal
      );

      return sim.result;
    } catch (e) {
      throw normalizeError(e, {
        op: "previewBorrow",
        args: [forUser, strategyId, collateralType, collateralAmount, assetsToBorrow],
        contract: contractName,
        chainId: this.chainId,
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
      const minAssetsOutForPreview = 0n;
      const sim = await abortable(
        this.init.client.public.simulateContract({
          address: this.getContract().address,
          abi: vaultAbi,
          functionName: "unborrow",
          args: [positionId, minAssetsOutForPreview, deadline],
          account: this.init.client.wallet.account!,
        }),
        signal
      );

      const denominator = 10_000n;
      const strategyTokensAmount = sim.result;
      const num = denominator - slippage;
      const adjustedTokensAmount = (strategyTokensAmount * num) / denominator;

      const gas =
        sim.request.gas ??
        (await this.init.client.public.estimateContractGas({
          address: this.getContract().address,
          abi: vaultAbi,
          functionName: "unborrow",
          args: [positionId, adjustedTokensAmount, deadline],
          account: this.init.client.wallet.account!,
        }));

      const gasAdj = (gas * 12n) / 10n;

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract({
        ...sim.request,
        args: [positionId, adjustedTokensAmount, deadline],
        gas: gasAdj,
      });
    } catch (e) {
      throw normalizeError(e, {
        op: "previewUnborrow",
        args: [positionId, deadline, slippage],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getAvailableLiquidity({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.availableLiquidity(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "availableLiquidity",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async withdrawYield([strategyIds]: [bigint[]], { signal }: SdkRequestOptions = {}) {
    if (!this.init.client.wallet) throw new WalletRequiredError("withdrawYield");

    const c = this.getContract();

    try {
      const sim = await abortable(
        this.init.client.public.simulateContract({
          address: c.address,
          abi: vaultAbi,
          functionName: "withdrawYield",
          args: [strategyIds],
          account: this.init.client.wallet.account!,
        }),
        signal
      );

      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (e) {
      throw normalizeError(e, {
        op: "withdrawYield",
        args: [strategyIds],
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getCurator({ signal }: SdkRequestOptions = {}) {
    try {
      return await abortable(this.getContract().read.getCurator(), signal);
    } catch (e) {
      throw normalizeError(e, {
        op: "getCurator",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }
}

export { vaultAbi, EV_BORROWER_POSITION_ACTIVATED };
