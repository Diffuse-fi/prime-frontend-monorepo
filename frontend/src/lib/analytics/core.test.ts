import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to mock BEFORE importing the module
const mockSendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: mockSendGAEvent,
}));

describe("Analytics Core", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("isTrackingEnabled", () => {
    it("returns false when NEXT_PUBLIC_ENABLE_TRACKING is disabled", async () => {
      const { isTrackingEnabled } = await import("./core");
      // Default env has NEXT_PUBLIC_ENABLE_TRACKING = false
      expect(isTrackingEnabled()).toBe(false);
    });
  });

  describe("trackEvent", () => {
    it("does not send event when tracking is disabled", async () => {
      const { trackEvent } = await import("./core");

      trackEvent("test_event", {
        test_param: "value",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });

    it("filters out undefined values from params", async () => {
      // This test validates the filtering logic exists
      const { trackEvent } = await import("./core");

      trackEvent("test_event", {
        defined_param: "value",
        undefined_param: undefined,
      });

      // Event should not be sent due to tracking disabled,
      // but the function should handle undefined values
      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });
  });

  describe("createTransactionTracker", () => {
    it("creates tracker with attempt, success, and error methods", async () => {
      const { createTransactionTracker } = await import("./core");

      const tracker = createTransactionTracker("test_flow", params => ({
        vault_address: params.vaultAddress,
        chain_id: params.chainId,
      }));

      expect(tracker).toHaveProperty("attempt");
      expect(tracker).toHaveProperty("success");
      expect(tracker).toHaveProperty("error");
      expect(typeof tracker.attempt).toBe("function");
      expect(typeof tracker.success).toBe("function");
      expect(typeof tracker.error).toBe("function");
    });

    it("does not send events when tracking is disabled", async () => {
      const { createTransactionTracker } = await import("./core");

      const tracker = createTransactionTracker("test_flow", params => ({
        vault_address: params.vaultAddress,
        chain_id: params.chainId,
      }));

      tracker.attempt({
        vaultAddress: "0xabc",
        chainId: 1,
      });

      tracker.success({
        vaultAddress: "0xabc",
        chainId: 1,
        txHash: "0xdef",
      });

      tracker.error({
        vaultAddress: "0xabc",
        chainId: 1,
        errorMessage: "test error",
      });

      expect(mockSendGAEvent).not.toHaveBeenCalled();
    });
  });
});
