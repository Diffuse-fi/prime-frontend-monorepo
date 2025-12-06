/**
 * Borrow flow analytics tracking.
 */

import { createTransactionTracker, type BaseEventParams } from "./core";

export type BorrowEventParams = BaseEventParams & {
  /** Strategy ID */
  strategyId?: string;
  /** Asset symbol (e.g., "USDC") */
  assetSymbol?: string;
  /** Collateral amount in human-readable format */
  collateralAmount?: string;
  /** Borrow amount in human-readable format */
  borrowAmount?: string;
};

const borrowTracker = createTransactionTracker<BorrowEventParams>("borrow", params => ({
  vault_address: params.vaultAddress,
  chain_id: params.chainId,
  strategy_id: params.strategyId,
  asset_symbol: params.assetSymbol,
  collateral_amount: params.collateralAmount,
  borrow_amount: params.borrowAmount,
}));

/**
 * Track when user initiates a borrow operation.
 */
export const trackBorrowAttempt = borrowTracker.attempt;

/**
 * Track when a borrow operation completes successfully.
 */
export const trackBorrowSuccess = borrowTracker.success;

/**
 * Track when a borrow operation fails.
 */
export const trackBorrowError = borrowTracker.error;
