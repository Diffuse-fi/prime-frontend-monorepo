/**
 * Core analytics utilities for GA4 event tracking.
 *
 * Provides generic, reusable tracking infrastructure that can be extended
 * for specific application flows.
 */

import { sendGAEvent } from "@next/third-parties/google";
import { env } from "@/env";

/**
 * Check if tracking is enabled based on environment configuration.
 */
export function isTrackingEnabled(): boolean {
  return !!env.NEXT_PUBLIC_ENABLE_TRACKING;
}

/**
 * Generic event parameters that all tracked events should include.
 */
export type BaseEventParams = {
  /** Vault contract address */
  vaultAddress: string;
  /** Chain ID */
  chainId: number;
};

/**
 * Standard transaction result parameters.
 */
export type TransactionResultParams =
  | { status: "attempt" }
  | { status: "success"; txHash: string }
  | { status: "error"; errorMessage: string };

/**
 * Safely send a GA4 event only when tracking is enabled.
 *
 * @param eventName - The name of the event to track
 * @param eventParams - Parameters to send with the event
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, string | number | boolean | undefined>
): void {
  if (!isTrackingEnabled()) {
    return;
  }

  // Filter out undefined values for cleaner GA4 data
  const filteredParams = Object.fromEntries(
    Object.entries(eventParams).filter(([, v]) => v !== undefined)
  );

  sendGAEvent("event", eventName, filteredParams);
}

/**
 * Generic transaction event tracker factory.
 *
 * Creates type-safe tracking functions for transaction-based flows (attempt, success, error).
 *
 * @param flowName - Name of the flow (e.g., "lend", "borrow")
 * @param paramsMapper - Function to map flow-specific params to GA4 event params
 * @returns Object with attempt, success, and error tracking functions
 */
export function createTransactionTracker<T extends BaseEventParams>(
  flowName: string,
  paramsMapper: (params: T) => Record<string, string | number | undefined>
) {
  return {
    attempt: (params: T) => {
      trackEvent(`${flowName}_attempt`, paramsMapper(params));
    },
    success: (params: T & { txHash: string }) => {
      trackEvent(`${flowName}_success`, {
        ...paramsMapper(params),
        tx_hash: params.txHash,
      });
    },
    error: (params: T & { errorMessage: string }) => {
      trackEvent(`${flowName}_error`, {
        ...paramsMapper(params),
        error_message: params.errorMessage,
      });
    },
  };
}
