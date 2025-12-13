import {
  Abi,
  Address,
  getContract,
  GetContractReturnType,
  PublicClient,
  WalletClient,
} from "viem";

import { Init } from "@/types";

import { resolveAddress } from "../../resolve";

export type GenericContractType<T extends Abi | readonly unknown[] = Abi> =
  | GetContractReturnType<T, PublicClient, Address>
  | GetContractReturnType<T, WalletClient, Address>;

export type SdkRequestOptions = {
  signal?: AbortSignal;
};

export class ContractBase {
  get chainId() {
    return this.init.chainId;
  }

  constructor(readonly init: Init) {}
}

export function getContractInstance<ContractAbi extends Abi>(
  init: Init,
  contractName: string,
  contractAbi: ContractAbi
) {
  const address = resolveAddress({
    addressOverride: init.address,
    chainId: init.chainId,
    contract: contractName,
  });

  const client = init.client.wallet
    ? { public: init.client.public, wallet: init.client.wallet }
    : { public: init.client.public };

  return getContract({ abi: contractAbi, address, client }) as GenericContractType<
    typeof contractAbi
  >;
}
