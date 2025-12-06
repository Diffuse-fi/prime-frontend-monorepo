/**
 * Lend (deposit) flow analytics tracking.
 */

import { createTransactionTracker, type BaseEventParams } from "./core";

export type LendEventParams = BaseEventParams & {
  /** Asset symbol (e.g., "USDC") */
  assetSymbol?: string;
  /** Amount in human-readable format */
  amount?: string;
};

const lendTracker = createTransactionTracker<LendEventParams>("lend", params => ({
  vault_address: params.vaultAddress,
  chain_id: params.chainId,
  asset_symbol: params.assetSymbol,
  amount: params.amount,
}));

/**
 * Track when user initiates a lend (deposit) operation.
 */
export const trackLendAttempt = lendTracker.attempt;

/**
 * Track when a lend (deposit) operation completes successfully.
 */
export const trackLendSuccess = lendTracker.success;

/**
 * Track when a lend (deposit) operation fails.
 */
export const trackLendError = lendTracker.error;
