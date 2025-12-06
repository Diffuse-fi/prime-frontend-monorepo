import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to mock BEFORE importing the module
const mockSendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: mockSendGAEvent,
}));

describe("Analytics Flow Modules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("Lend Flow", () => {
    it("trackLendAttempt does not send event when tracking is disabled", async () => {
      const { trackLendAttempt } = await import("./lend");

      trackLendAttempt({
        vaultAddress: "0x1234567890abcdef",
        chainId: 1,
        assetSymbol: "USDC",
        amount: "1000",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackLendSuccess does not send event when tracking is disabled", async () => {
      const { trackLendSuccess } = await import("./lend");

      trackLendSuccess({
        vaultAddress: "0x1234567890abcdef",
        chainId: 1,
        assetSymbol: "USDC",
        amount: "1000",
        txHash: "0xabc",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackLendError does not send event when tracking is disabled", async () => {
      const { trackLendError } = await import("./lend");

      trackLendError({
        vaultAddress: "0x1234567890abcdef",
        chainId: 1,
        assetSymbol: "USDC",
        amount: "1000",
        errorMessage: "Transaction failed",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });
  });

  describe("Withdraw Flow", () => {
    it("trackWithdrawAttempt does not send event when tracking is disabled", async () => {
      const { trackWithdrawAttempt } = await import("./withdraw");

      trackWithdrawAttempt({
        vaultAddress: "0xabcdef1234567890",
        chainId: 42161,
        assetSymbol: "ETH",
        amount: "5.5",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackWithdrawSuccess does not send event when tracking is disabled", async () => {
      const { trackWithdrawSuccess } = await import("./withdraw");

      trackWithdrawSuccess({
        vaultAddress: "0xabcdef1234567890",
        chainId: 42161,
        assetSymbol: "ETH",
        amount: "5.5",
        txHash: "0xdef",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackWithdrawError does not send event when tracking is disabled", async () => {
      const { trackWithdrawError } = await import("./withdraw");

      trackWithdrawError({
        vaultAddress: "0xabcdef1234567890",
        chainId: 42161,
        assetSymbol: "ETH",
        amount: "5.5",
        errorMessage: "Insufficient balance",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });
  });

  describe("Borrow Flow", () => {
    it("trackBorrowAttempt does not send event when tracking is disabled", async () => {
      const { trackBorrowAttempt } = await import("./borrow");

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

    it("trackBorrowSuccess does not send event when tracking is disabled", async () => {
      const { trackBorrowSuccess } = await import("./borrow");

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

    it("trackBorrowError does not send event when tracking is disabled", async () => {
      const { trackBorrowError } = await import("./borrow");

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
  });

  describe("Cancel Borrow Flow", () => {
    it("trackCancelBorrowAttempt does not send event when tracking is disabled", async () => {
      const { trackCancelBorrowAttempt } = await import("./cancelBorrow");

      trackCancelBorrowAttempt({
        vaultAddress: "0xfedcba9876543210",
        chainId: 10,
        positionId: "456",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackCancelBorrowSuccess does not send event when tracking is disabled", async () => {
      const { trackCancelBorrowSuccess } = await import("./cancelBorrow");

      trackCancelBorrowSuccess({
        vaultAddress: "0xfedcba9876543210",
        chainId: 10,
        positionId: "456",
        txHash: "0x789",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("trackCancelBorrowError does not send event when tracking is disabled", async () => {
      const { trackCancelBorrowError } = await import("./cancelBorrow");

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
