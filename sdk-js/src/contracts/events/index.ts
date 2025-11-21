import { AbiItemNotFoundError } from "@/errors";
import { Abi, AbiItemName } from "viem";

export function getEvent<ContractAbi extends Abi>(
  abi: ContractAbi,
  name: AbiItemName<ContractAbi>
) {
  const item = abi.find(item => item.type === "event" && item.name === name);

  if (!item) {
    throw new AbiItemNotFoundError(name, { abi });
  }

  return item;
}
