import { resolveAddress } from "../../resolve";
import { Init } from "@/types";
import {
  Abi,
  Address,
  getContract,
  GetContractReturnType,
  PublicClient,
  WalletClient,
} from "viem";

export class ContractBase {
  constructor(readonly init: Init) {}

  get chainId() {
    return this.init.chainId;
  }
}

export type GenericContractType<T extends Abi | readonly unknown[] = Abi> =
  | GetContractReturnType<T, WalletClient, Address>
  | GetContractReturnType<T, PublicClient, Address>;

export type SdkRequestOptions = {
  signal?: AbortSignal;
};

export function getContractInstance<ContractAbi extends Abi>(
  init: Init,
  contractName: string,
  contractAbi: ContractAbi
) {
  const address = resolveAddress({
    chainId: init.chainId,
    contract: contractName,
    addressOverride: init.address,
  });

  const client = init.client.wallet
    ? { public: init.client.public, wallet: init.client.wallet }
    : { public: init.client.public };

  return getContract({ address, abi: contractAbi, client }) as GenericContractType<
    typeof contractAbi
  >;
}
