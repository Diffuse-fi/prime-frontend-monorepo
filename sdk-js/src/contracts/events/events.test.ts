import { describe, it, expect } from "vitest";
import { getEvent } from "./events";
import { AbiItemNotFoundError } from "@/errors";
import type { Abi, AbiEvent } from "viem";

const abi: Abi = [
  {
    type: "event",
    name: "Borrow",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Repay",
    inputs: [],
    anonymous: false,
  },
];

describe("getEvent", () => {
  it("returns the event when it exists", () => {
    const event = getEvent(abi, "Borrow", "Vault") as AbiEvent;
    expect(event).toBeDefined();
    expect(event.name).toBe("Borrow");
  });

  it("throws AbiItemNotFoundError when event does not exist", () => {
    expect(() => getEvent(abi, "UnknownEvent" as any, "Vault")).toThrow(
      new AbiItemNotFoundError("UnknownEvent", { contractName: "Vault" })
    );
  });
});
