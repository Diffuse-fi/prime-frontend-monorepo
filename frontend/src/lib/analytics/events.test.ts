import { beforeEach, describe, expect, it, vi } from "vitest";

import { trackEvent, trackPageView } from "./events";

// Mock @next/third-parties/google
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
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "wallet_connect", { chain_id: 1 });
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
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "chain_switch", { chain_id: 42_161 });
    });

    it("should handle errors gracefully in development", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      
      vi.mocked(sendGAEvent).mockImplementation(() => {
        throw new Error("GA error");
      });
      
      // Should not throw
      expect(() => trackEvent("wallet_connect")).not.toThrow();
      
      consoleWarnSpy.mockRestore();
    });

    it("should track without parameters", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      
      trackEvent("wallet_disconnect");
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "wallet_disconnect", {});
    });
  });

  describe("trackPageView", () => {
    it("should track page view with path for home", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      
      trackPageView("/");
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "page_view_home", {
        modal_name: undefined,
        value: "/",
      });
    });

    it("should track page view for lend page", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      
      trackPageView("/lend", "Lend Page");
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "page_view_lend", {
        modal_name: "Lend Page",
        value: "/lend",
      });
    });

    it("should track page view for borrow page", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      
      trackPageView("/borrow");
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "page_view_borrow", {
        modal_name: undefined,
        value: "/borrow",
      });
    });

    it("should track page view for my positions lend page", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      
      trackPageView("/lend/my-positions");
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "page_view_my_positions_lend", {
        modal_name: undefined,
        value: "/lend/my-positions",
      });
    });

    it("should track page view for my positions borrow page", async () => {
      const { sendGAEvent } = await import("@next/third-parties/google");
      
      trackPageView("/borrow/my-positions");
      
      expect(sendGAEvent).toHaveBeenCalledWith("event", "page_view_my_positions_borrow", {
        modal_name: undefined,
        value: "/borrow/my-positions",
      });
    });
  });
});
