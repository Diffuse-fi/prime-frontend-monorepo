import { Init } from "@/types";
import { Abi, Address, GetContractReturnType, PublicClient, WalletClient } from "viem";

export class ContractBase {
  constructor(readonly init: Init) {}

  get chainId() {
    return this.init.chainId;
  }
}

export type GenericContractType<T extends Abi | readonly unknown[] = Abi> =
  | GetContractReturnType<T, WalletClient, Address>
  | GetContractReturnType<T, PublicClient, Address>;
