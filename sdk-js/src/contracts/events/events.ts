import { Abi, AbiItemName } from "viem";

import { AbiItemNotFoundError } from "@/errors";

export function getEvent<ContractAbi extends Abi>(
  abi: ContractAbi,
  name: AbiItemName<ContractAbi>,
  contractName: string
) {
  const item = abi.find(item => item.type === "event" && item.name === name);

  if (!item) {
    throw new AbiItemNotFoundError(name, { contractName });
  }

  return item;
}
