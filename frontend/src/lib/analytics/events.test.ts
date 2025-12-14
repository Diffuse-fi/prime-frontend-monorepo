import { beforeEach, describe, expect, it, vi } from "vitest";

import { trackEvent } from "./events";

vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: vi.fn(),
}));

describe("Analytics Events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("trackEvent", () => {
    it("should call sendGAEvent with correct parameters", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");

      trackEvent("wallet_connect", { chain_id: 1 });

      expect(sendGAEvent).toHaveBeenCalledWith("event", "wallet_connect", {
        chain_id: 1,
      });
    });

    it("should track lend deposit success with parameters", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");

      const params = {
        amount: "1000",
        asset_symbol: "USDC",
        chain_id: 1,
        transaction_hash: "0x123",
      };

      trackEvent("lend_deposit_success", params);

      expect(sendGAEvent).toHaveBeenCalledWith("event", "lend_deposit_success", params);
    });

    it("should track borrow request with leverage", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");

      const params = {
        asset_symbol: "ETH",
        chain_id: 1,
        leverage: 3,
      };

      trackEvent("borrow_request_start", params);

      expect(sendGAEvent).toHaveBeenCalledWith("event", "borrow_request_start", params);
    });

    it("should track chain switch", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");

      trackEvent("chain_switch", { chain_id: 42_161 });

      expect(sendGAEvent).toHaveBeenCalledWith("event", "chain_switch", {
        chain_id: 42_161,
      });
    });

    it("should handle errors gracefully in development", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      vi.mocked(sendGAEvent).mockImplementation(() => {
        throw new Error("GA error");
      });

      expect(() => trackEvent("wallet_connect")).not.toThrow();

      consoleWarnSpy.mockRestore();
    });

    it("should track without parameters", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");

      trackEvent("wallet_disconnect");

      expect(sendGAEvent).toHaveBeenCalledWith("event", "wallet_disconnect", {});
    });

    it("should NOT call sendGAEvent when tracking is disabled", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_ENABLE_TRACKING;

      process.env.NEXT_PUBLIC_ENABLE_TRACKING = "false";

      vi.resetModules();
      const { trackEvent: trackEventWithTrackingDisabled } = await import("./events");
      const { sendGAEvent } = await import("@next/third-parties/google");

      trackEventWithTrackingDisabled("wallet_connect", { chain_id: 1 });

      expect(sendGAEvent).not.toHaveBeenCalled();

      process.env.NEXT_PUBLIC_ENABLE_TRACKING = originalEnv;
    });
  });
});
