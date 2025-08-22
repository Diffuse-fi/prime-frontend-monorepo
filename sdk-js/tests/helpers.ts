import { vi } from "vitest";
import type { Address } from "viem";

export const mockWriteContract = vi.fn();
export const mockReadContract = vi.fn();
export const mockSimulateContract = vi.fn();
export const mockMulticall = vi.fn();

export function makePublicClientMock() {
  return {
    readContract: mockReadContract,
    simulateContract: mockSimulateContract,
    multicall: mockMulticall,
  };
}

export function makeWalletClientMock(
  addr: Address = "0x1111111111111111111111111111111111111111"
) {
  return {
    account: { address: addr },
    writeContract: mockWriteContract,
  };
}
