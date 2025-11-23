import { describe, it, expect, vi } from "vitest";
import { AddressNotFoundError } from "../errors";

vi.mock("./addresses.json", () => ({
  default: {
    chains: {
      "1": {
        name: "Ethereum",
        contracts: {
          Viewer: { current: "0x0000000000000000000000000000000000000001" },
          NoCurrent: {},
        },
      },
    },
  },
}));

const { getEntryOrThrow, getAddressFor, ADDRESS_BOOK } = await import("./addressBook");

describe("ADDRESS_BOOK", () => {
  it("builds address book from JSON with chain name and contracts", () => {
    expect(ADDRESS_BOOK[1].name).toBe("Ethereum");
    expect(ADDRESS_BOOK[1].Viewer.current).toBe(
      "0x0000000000000000000000000000000000000001"
    );
  });

  it("getEntryOrThrow returns entry for existing contract", () => {
    const entry = getEntryOrThrow(1, "Viewer");

    expect(entry.current).toBe("0x0000000000000000000000000000000000000001");
  });

  it("getAddressFor throws AddressNotFoundError when entry is missing or has no current", () => {
    expect(() => getEntryOrThrow(1, "UnknownContract")).toThrow(
      new AddressNotFoundError({
        chainId: 1,
        contract: "UnknownContract",
      })
    );

    expect(() => getAddressFor(1, "NoCurrent")).toThrow(
      new AddressNotFoundError({
        chainId: 1,
        contract: "NoCurrent",
      })
    );
  });
});
