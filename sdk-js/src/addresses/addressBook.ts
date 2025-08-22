import addressesJson from "./addresses.json" with { type: "json" };
import { type Address } from "viem";
import { AddressNotFoundError } from "../errors";

export type ContractName = "Vault";

export type Entry = {
  current?: Address;
};

export type AddressBook = {
  [chainId: number]: {
    [contractName in ContractName]: Entry;
  } & { name?: string };
};

function createAddressBookFromJson(): AddressBook {
  return Object.entries(addressesJson.chains).reduce((acc, [chainIdStr, chainData]) => {
    const chainId = Number(chainIdStr);

    acc[chainId] = Object.entries(chainData.contracts).reduce(
      (chainAcc, [contractName, contractData]) => {
        chainAcc[contractName as ContractName] = {
          current: contractData.current ? (contractData.current as Address) : undefined,
        };

        return chainAcc;
      },
      {} as Record<ContractName, Entry>
    );

    acc[chainId].name = chainData.name;

    return acc;
  }, {} as AddressBook);
}

export const ADDRESS_BOOK: AddressBook = createAddressBookFromJson();

export function getEntryOrThrow(chainId: number, contract: ContractName): Entry {
  const byChain = ADDRESS_BOOK[chainId];
  const entry = byChain?.[contract];

  if (!entry) {
    throw new AddressNotFoundError({ chainId, contract });
  }

  return entry;
}

export function getAddressFor(chainId: number, contract: ContractName): Address {
  const entry = getEntryOrThrow(chainId, contract);

  if (!entry.current) {
    throw new AddressNotFoundError({
      chainId,
      contract,
    });
  }

  return entry.current;
}
