import { describe, it, expect, vi } from "vitest";
import { resolveAddress } from "./resolve";
import { AddressNotFoundError, InvalidAddressError } from "@/errors";
import { AddressBook, ContractName } from "./addressBook";
import { getAddress, isAddressEqual } from "viem";

vi.mock("./addressBook", () => {
  return {
    getAddressFor: (chainId: number, contract: ContractName) => {
      const book: AddressBook = {
        1: {
          Vault: {
            current: "0x0000000000000000000000000000000000000aaa",
          },
        },
        80085: {
          Vault: {
            current: "0x0000000000000000000000000000000000000bbb",
          },
        },
      };

      const byChain = book[chainId];

      if (!byChain || !byChain[contract]) {
        throw new AddressNotFoundError({ chainId, contract: contract });
      }

      return byChain[contract].current;
    },
  };
});

describe("resolveAddress", () => {
  it("returns override if provided", () => {
    const override = "0x0000000000000000000000000000000000000ccc";

    const out = resolveAddress({
      chainId: 1,
      contract: "Vault",
      addressOverride: override,
    });

    expect(isAddressEqual(out, override)).toBe(true);
  });

  it("returns current from ADDRESS_BOOK", () => {
    const out = resolveAddress({ chainId: 80085, contract: "Vault" });

    expect(
      isAddressEqual(out, getAddress("0x0000000000000000000000000000000000000bbb"))
    ).toBe(true);
  });

  it("throws AddressNotFoundError for missing chain", () => {
    expect(() => resolveAddress({ chainId: 999, contract: "Vault" })).toThrow(
      new AddressNotFoundError({ chainId: 999, contract: "Vault" })
    );
  });

  it("throws InvalidAddressError on malformed override", () => {
    expect(() =>
      resolveAddress({
        chainId: 1,
        contract: "Vault",
        addressOverride: "0x_not-an-address",
      })
    ).toThrow(
      new InvalidAddressError("0x_not-an-address", {
        chainId: 1,
        contract: "Vault",
      })
    );
  });
});
