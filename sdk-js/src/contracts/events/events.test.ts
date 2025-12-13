import type { Abi, AbiEvent } from "viem";

import { describe, expect, it } from "vitest";

import { AbiItemNotFoundError } from "@/errors";

import { getEvent } from "./events";

const abi: Abi = [
  {
    anonymous: false,
    inputs: [],
    name: "Borrow",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Repay",
    type: "event",
  },
];

describe("getEvent", () => {
  it("returns the event when it exists", () => {
    const event = getEvent(abi, "Borrow", "Vault") as AbiEvent;
    expect(event).toBeDefined();
    expect(event.name).toBe("Borrow");
  });

  it("throws AbiItemNotFoundError when event does not exist", () => {
    expect(() => getEvent(abi, "UnknownEvent", "Vault")).toThrow(
      new AbiItemNotFoundError("UnknownEvent", { contractName: "Vault" })
    );
  });
});
