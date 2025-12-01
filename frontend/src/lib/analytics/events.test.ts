import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to mock BEFORE importing the module
const mockSendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: mockSendGAEvent,
}));

describe("Analytics Events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset all modules to get fresh imports
    vi.resetModules();
  });

  describe("when tracking is disabled (default env)", () => {
    it("isTrackingEnabled returns false", async () => {
      const { isTrackingEnabled } = await import("./events");
      expect(isTrackingEnabled()).toBe(false);
    });

    it("trackLendAttempt does not send event", async () => {
      const { trackLendAttempt } = await import("./events");

      trackLendAttempt({
        vaultAddress: "0x1234567890abcdef",
        chainId: 1,
        assetSymbol: "USDC",
        amount: "1000",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackLendSuccess does not send event", async () => {
      const { trackLendSuccess } = await import("./events");

      trackLendSuccess({
        vaultAddress: "0x1234567890abcdef",
        chainId: 1,
        assetSymbol: "USDC",
        amount: "1000",
        txHash: "0xabc",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackLendError does not send event", async () => {
      const { trackLendError } = await import("./events");

      trackLendError({
        vaultAddress: "0x1234567890abcdef",
        chainId: 1,
        assetSymbol: "USDC",
        amount: "1000",
        errorMessage: "Transaction failed",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackWithdrawAttempt does not send event", async () => {
      const { trackWithdrawAttempt } = await import("./events");

      trackWithdrawAttempt({
        vaultAddress: "0xabcdef1234567890",
        chainId: 42161,
        assetSymbol: "ETH",
        amount: "5.5",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackWithdrawSuccess does not send event", async () => {
      const { trackWithdrawSuccess } = await import("./events");

      trackWithdrawSuccess({
        vaultAddress: "0xabcdef1234567890",
        chainId: 42161,
        assetSymbol: "ETH",
        amount: "5.5",
        txHash: "0xdef",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackWithdrawError does not send event", async () => {
      const { trackWithdrawError } = await import("./events");

      trackWithdrawError({
        vaultAddress: "0xabcdef1234567890",
        chainId: 42161,
        assetSymbol: "ETH",
        amount: "5.5",
        errorMessage: "Insufficient balance",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackBorrowAttempt does not send event", async () => {
      const { trackBorrowAttempt } = await import("./events");

      trackBorrowAttempt({
        vaultAddress: "0x9876543210fedcba",
        chainId: 137,
        strategyId: "123",
        assetSymbol: "USDT",
        collateralAmount: "2000",
        borrowAmount: "1500",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackBorrowSuccess does not send event", async () => {
      const { trackBorrowSuccess } = await import("./events");

      trackBorrowSuccess({
        vaultAddress: "0x9876543210fedcba",
        chainId: 137,
        strategyId: "123",
        assetSymbol: "USDT",
        collateralAmount: "2000",
        borrowAmount: "1500",
        txHash: "0x123",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackBorrowError does not send event", async () => {
      const { trackBorrowError } = await import("./events");

      trackBorrowError({
        vaultAddress: "0x9876543210fedcba",
        chainId: 137,
        strategyId: "123",
        assetSymbol: "USDT",
        collateralAmount: "2000",
        borrowAmount: "1500",
        errorMessage: "Slippage exceeded",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackCancelBorrowAttempt does not send event", async () => {
      const { trackCancelBorrowAttempt } = await import("./events");

      trackCancelBorrowAttempt({
        vaultAddress: "0xfedcba9876543210",
        chainId: 10,
        positionId: "456",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackCancelBorrowSuccess does not send event", async () => {
      const { trackCancelBorrowSuccess } = await import("./events");

      trackCancelBorrowSuccess({
        vaultAddress: "0xfedcba9876543210",
        chainId: 10,
        positionId: "456",
        txHash: "0x789",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackCancelBorrowError does not send event", async () => {
      const { trackCancelBorrowError } = await import("./events");

      trackCancelBorrowError({
        vaultAddress: "0xfedcba9876543210",
        chainId: 10,
        positionId: "456",
        errorMessage: "Position not found",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });
  });
});
