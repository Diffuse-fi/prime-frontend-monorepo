import { getAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import { resolveAddress } from ".";
import { AddressNotFoundError, InvalidAddressError } from "../errors";

vi.mock("@diffuse/config", () => ({
  ADDRESSES: {
    chains: [
      {
        chainId: 1,
        contracts: {
          Viewer: {
            current: "0x6cc9bF3151Ff39846B0570CED355Ded5C0Bb7D76",
          },
        },
        name: "Mainnet",
      },
    ],
  },
}));

describe("resolveAddress", () => {
  it("resolves address from config when no override is provided", () => {
    const result = resolveAddress({ chainId: 1, contract: "Viewer" });

    expect(result).toBe(getAddress("0x6cc9bF3151Ff39846B0570CED355Ded5C0Bb7D76"));
  });

  it("normalizes a valid override address and prefers it over config", () => {
    const override = "0x6cc9bf3151ff39846b0570ced355ded5c0bb7d76";

    const result = resolveAddress({
      addressOverride: override,
      chainId: 1,
      contract: "Viewer",
    });

    expect(result).toBe(getAddress(override));
  });

  it("throws InvalidAddressError for invalid override address", () => {
    expect(() =>
      resolveAddress({
        addressOverride: "0x123",
        chainId: 1,
        contract: "Viewer",
      })
    ).toThrow(new InvalidAddressError("0x123", { chainId: 1, contract: "Viewer" }));
  });

  it("throws when chain is not found", () => {
    expect(() =>
      resolveAddress({
        chainId: 999,
        contract: "Viewer",
      })
    ).toThrow(
      new AddressNotFoundError({
        chainId: 999,
        contract: "Viewer",
        meta: "No addresses configured for this chain ID",
      })
    );
  });

  it("throws when contract is not found on the chain", () => {
    expect(() =>
      resolveAddress({
        chainId: 1,
        contract: "UnknownContract",
      })
    ).toThrow(
      new AddressNotFoundError({
        chainId: 1,
        contract: "UnknownContract",
        meta: "No address configured for this contract on the specified chain",
      })
    );
  });
});
