import {
  Address,
  getContract,
  GetContractReturnType,
  PublicClient,
  WalletClient,
} from "viem";
import { vaultAbi } from "./abi";
import { resolveAddress } from "../../addresses/resolve";
import { Init } from "@/types";
import { normalizeViemError } from "@/errors/normalize";
import { WalletRequiredError } from "@/errors/errors";

type VaultContract =
  | GetContractReturnType<typeof vaultAbi, WalletClient, Address>
  | GetContractReturnType<typeof vaultAbi, PublicClient, Address>;

const contractName = "Vault";

function _addr(init: Init): Address {
  return resolveAddress({
    chainId: init.chainId,
    contract: contractName,
    addressOverride: init.address,
  });
}

export function getVaultContract(init: Init): VaultContract {
  const address = _addr(init);

  const client = init.client.wallet
    ? { public: init.client.public, wallet: init.client.wallet }
    : { public: init.client.public };

  return getContract({ address, abi: vaultAbi, client }) as VaultContract;
}

export class Vault {
  constructor(private readonly init: Init) {}

  private getContract() {
    return getVaultContract(this.init);
  }
  private get chainId() {
    return this.init.chainId;
  }

  async availableLiquidity(): Promise<bigint> {
    try {
      return this.getContract().read.availableLiquidity();
    } catch (e) {
      throw normalizeViemError(e, {
        op: "availableLiquidity",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async getBorrowAPR(): Promise<bigint> {
    try {
      return this.getContract().read.getBorrowAPR();
    } catch (e) {
      throw normalizeViemError(e, {
        op: "getBorrowAPR",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async totalAssets(): Promise<bigint> {
    try {
      return this.getContract().read.totalAssets();
    } catch (e) {
      throw normalizeViemError(e, {
        op: "totalAssets",
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async balanceOf(user: Address): Promise<bigint> {
    try {
      return this.getContract().read.balanceOf([user]);
    } catch (e) {
      throw normalizeViemError(e, {
        op: "balanceOf",
        contract: contractName,
        chainId: this.chainId,
        user,
      });
    }
  }

  async getBorrowerPositions(user: Address) {
    try {
      const ids = await this.getContract().read.getBorrowerPositionIds([
        user,
      ]);
      if (!ids.length) return [];

      const positions = await Promise.all(
        ids.map(id =>
          this.init.client.public.readContract({
            address: this.getContract().address,
            abi: vaultAbi,
            functionName: "getBorrowerPosition",
            args: [id],
          })
        )
      );

      return positions;
    } catch (e) {
      throw normalizeViemError(e, {
        op: "getBorrowerPositions",
        user,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async deposit(args: [bigint, Address]) {
    if (!this.init.client.wallet) throw new WalletRequiredError("deposit");

    const c = this.getContract();

    try {
      if (!this.init.client.wallet) throw new WalletRequiredError("deposit");

      const sim = await this.init.client.public.simulateContract({
        address: c.address,
        abi: vaultAbi,
        functionName: "deposit",
        args,
        account: this.init.client.wallet.account!,
      });

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (e) {
      throw normalizeViemError(e, {
        op: "deposit",
        args,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async withdraw(args: [bigint, Address, Address]) {
    if (!this.init.client.wallet) throw new WalletRequiredError("withdraw");

    const c = this.getContract();

    try {
      const sim = await this.init.client.public.simulateContract({
        address: c.address,
        abi: vaultAbi,
        functionName: "withdraw",
        args,
        account: this.init.client.wallet.account!,
      });

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (e) {
      throw normalizeViemError(e, {
        op: "withdraw",
        args,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async redeem(args: [bigint, Address, Address]) {
    if (!this.init.client.wallet) throw new WalletRequiredError("redeem");

    const c = this.getContract();

    try {
      const sim = await this.init.client.public.simulateContract({
        address: c.address,
        abi: vaultAbi,
        functionName: "redeem",
        args,
        account: this.init.client.wallet.account!,
      });

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (e) {
      throw normalizeViemError(e, {
        op: "redeem",
        args,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async borrow(args: [bigint, bigint, bigint, bigint, bigint]) {
    if (!this.init.client.wallet) throw new WalletRequiredError("borrow");

    const c = this.getContract();

    try {
      const sim = await this.init.client.public.simulateContract({
        address: c.address,
        abi: vaultAbi,
        functionName: "borrow",
        args,
        account: this.init.client.wallet.account!,
      });

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (e) {
      throw normalizeViemError(e, {
        op: "borrow",
        args,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }

  async unborrow(args: [bigint, bigint]) {
    if (!this.init.client.wallet) throw new WalletRequiredError("unborrow");

    const c = this.getContract();

    try {
      const sim = await this.init.client.public.simulateContract({
        address: c.address,
        abi: vaultAbi,
        functionName: "unborrow",
        args,
        account: this.init.client.wallet.account!,
      });

      return await this.init.client.wallet.writeContract(sim.request);
    } catch (e) {
      throw normalizeViemError(e, {
        op: "unborrow",
        args,
        contract: contractName,
        chainId: this.chainId,
      });
    }
  }
}
