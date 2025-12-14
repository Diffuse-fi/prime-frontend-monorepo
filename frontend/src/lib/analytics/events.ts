"use client";

import { sendGAEvent } from "@next/third-parties/google";

import { env } from "@/env";

import { createLogger } from "../logger/logger";

export type EventName =
  | `borrow_${string}`
  | `chain_${string}`
  | `lend_${string}`
  | `position_${string}`
  | `wallet_${string}`;

const analyticsLogger = createLogger("analytics");

export interface EventParams {
  [key: string]: boolean | number | string | undefined;
}

export function trackEvent(name: EventName, params: EventParams = {}): void {
  try {
    if (!env.NEXT_PUBLIC_ENABLE_TRACKING) {
      return;
    }

    if (globalThis.window === undefined) {
      return;
    }

    sendGAEvent("event", name, params);
    analyticsLogger.debug("Tracked event", { name, params });
  } catch {
    if (process.env.NODE_ENV === "development") {
      analyticsLogger.error("Failed to track event", { name, params });
    }
  }
}
