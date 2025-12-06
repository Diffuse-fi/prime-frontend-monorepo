/**
 * Cancel borrow (unborrow) flow analytics tracking.
 */

import { createTransactionTracker, type BaseEventParams } from "./core";

export type CancelBorrowEventParams = BaseEventParams & {
  /** Position ID */
  positionId?: string;
};

const cancelBorrowTracker = createTransactionTracker<CancelBorrowEventParams>(
  "cancel_borrow",
  params => ({
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    position_id: params.positionId,
  })
);

/**
 * Track when user initiates a cancel borrow (unborrow) operation.
 */
export const trackCancelBorrowAttempt = cancelBorrowTracker.attempt;

/**
 * Track when a cancel borrow (unborrow) operation completes successfully.
 */
export const trackCancelBorrowSuccess = cancelBorrowTracker.success;

/**
 * Track when a cancel borrow (unborrow) operation fails.
 */
export const trackCancelBorrowError = cancelBorrowTracker.error;
