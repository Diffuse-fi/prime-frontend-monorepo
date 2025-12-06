/**
 * Withdraw flow analytics tracking.
 */

import { createTransactionTracker, type BaseEventParams } from "./core";

export type WithdrawEventParams = BaseEventParams & {
  /** Asset symbol (e.g., "USDC") */
  assetSymbol?: string;
  /** Amount in human-readable format */
  amount?: string;
};

const withdrawTracker = createTransactionTracker<WithdrawEventParams>(
  "withdraw",
  params => ({
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    asset_symbol: params.assetSymbol,
    amount: params.amount,
  })
);

/**
 * Track when user initiates a withdraw operation.
 */
export const trackWithdrawAttempt = withdrawTracker.attempt;

/**
 * Track when a withdraw operation completes successfully.
 */
export const trackWithdrawSuccess = withdrawTracker.success;

/**
 * Track when a withdraw operation fails.
 */
export const trackWithdrawError = withdrawTracker.error;
