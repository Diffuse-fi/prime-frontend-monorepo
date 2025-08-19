import { Address, getContract, PublicClient, WalletClient } from "viem";
import { lendingAbi } from "./abi";
import { resolveAddress } from "../../addresses/resolve";

export type LendingInit = {
  client: { public: PublicClient; wallet?: WalletClient };
  chainId: number;
  address?: Address;
};

function _addr(init: LendingInit): Address {
  return resolveAddress({
    chainId: init.chainId,
    contract: "LendingVault",
    addressOverride: init.address,
  });
}

function getLendingContract(init: LendingInit) {
  const address = _addr(init);
  const client = init.client.wallet
    ? { public: init.client.public, wallet: init.client.wallet }
    : { public: init.client.public };
  return getContract({ address, abi: lendingAbi, client });
}

export const Lending = Object.freeze({
  async availableLiquidity(init: LendingInit): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.availableLiquidity();
  },
  async getBorrowAPR(init: LendingInit): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.getBorrowAPR();
  },
  async totalAssets(init: LendingInit): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.totalAssets();
  },
  async balanceOf(init: LendingInit, user: Address): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.balanceOf([user]);
  },
  async getBorrowerPositions(init: LendingInit, user: Address) {
    const c = getLendingContract(init);
    const client = init.client.public;
    const ids = (await c.read.getBorrowerPositionIds([user])) as bigint[];
    if (!ids.length) return [];
    const results = await client.multicall({
      allowFailure: false,
      contracts: ids.map(id => ({
        address: c.address,
        abi: lendingAbi,
        functionName: "getBorrowerPosition",
        args: [id],
      })),
    });
    return results;
  },

  /** ---- Curated helpers (writes). These simulate before sending. ---- */
  async deposit(init: LendingInit, args: [bigint, Address]) {
    if (!init.client.wallet) throw new Error("wallet client is required for writes");
    const c = getLendingContract(init);
    const sim = await init.client.public.simulateContract({
      address: c.address,
      abi: lendingAbi,
      functionName: "deposit",
      args,
      account: init.client.wallet.account!,
    });
    return init.client.wallet.writeContract(sim.request);
  },

  async withdraw(init: LendingInit, args: [bigint, Address, Address]) {
    if (!init.client.wallet) throw new Error("wallet client is required for writes");
    const c = getLendingContract(init);
    const sim = await init.client.public.simulateContract({
      address: c.address,
      abi: lendingAbi,
      functionName: "withdraw",
      args,
      account: init.client.wallet.account!,
    });
    return init.client.wallet.writeContract(sim.request);
  },

  async redeem(init: LendingInit, args: [bigint, Address, Address]) {
    if (!init.client.wallet) throw new Error("wallet client is required for writes");
    const c = getLendingContract(init);
    const sim = await init.client.public.simulateContract({
      address: c.address,
      abi: lendingAbi,
      functionName: "redeem",
      args,
      account: init.client.wallet.account!,
    });
    return init.client.wallet.writeContract(sim.request);
  },

  async borrow(init: LendingInit, args: [bigint, bigint, bigint, bigint, bigint]) {
    if (!init.client.wallet) throw new Error("wallet client is required for writes");
    const c = getLendingContract(init);
    const sim = await init.client.public.simulateContract({
      address: c.address,
      abi: lendingAbi,
      functionName: "borrow",
      args,
      account: init.client.wallet.account!,
    });
    return init.client.wallet.writeContract(sim.request);
  },

  async unborrow(init: LendingInit, args: [bigint, bigint]) {
    if (!init.client.wallet) throw new Error("wallet client is required for writes");
    const c = getLendingContract(init);
    const sim = await init.client.public.simulateContract({
      address: c.address,
      abi: lendingAbi,
      functionName: "unborrow",
      args,
      account: init.client.wallet.account!,
    });
    return init.client.wallet.writeContract(sim.request);
  },
});
