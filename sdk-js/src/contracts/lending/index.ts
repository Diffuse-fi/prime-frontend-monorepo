import { Address, getContract } from "viem";
import { lendingAbi } from "./abi";
import { resolveAddress } from "../../addresses/resolve";
import { Init } from "@/types";

function _addr(init: Init): Address {
  return resolveAddress({
    chainId: init.chainId,
    contract: "LendingVault",
    addressOverride: init.address,
  });
}

export function getLendingContract(init: Init) {
  const address = _addr(init);

  const client = init.client.wallet
    ? { public: init.client.public, wallet: init.client.wallet }
    : { public: init.client.public };

  return getContract({ address, abi: lendingAbi, client });
}

export const Lending = Object.freeze({
  async availableLiquidity(init: Init): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.availableLiquidity();
  },
  async getBorrowAPR(init: Init): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.getBorrowAPR();
  },
  async totalAssets(init: Init): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.totalAssets();
  },
  async balanceOf(init: Init, user: Address): Promise<bigint> {
    const c = getLendingContract(init);
    return c.read.balanceOf([user]);
  },
  async getBorrowerPositions(init: Init, user: Address) {
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

  async deposit(init: Init, args: [bigint, Address]) {
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

  async withdraw(init: Init, args: [bigint, Address, Address]) {
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

  async redeem(init: Init, args: [bigint, Address, Address]) {
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

  async borrow(init: Init, args: [bigint, bigint, bigint, bigint, bigint]) {
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

  async unborrow(init: Init, args: [bigint, bigint]) {
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
