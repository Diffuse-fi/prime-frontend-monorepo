/**
 * GA4 event tracking utilities for main application flows.
 *
 * Events are only sent when NEXT_PUBLIC_ENABLE_TRACKING is true.
 * This module provides type-safe event tracking for:
 * - Lend (deposit) flow
 * - Withdraw flow
 * - Borrow flow
 * - Cancel borrow (unborrow) flow
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
 * Safely send a GA4 event only when tracking is enabled.
 */
function trackEvent(
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

// ============================================================================
// Lend (Deposit) Flow Events
// ============================================================================

export type LendEventParams = {
  /** Vault contract address */
  vaultAddress: string;
  /** Chain ID */
  chainId: number;
  /** Asset symbol (e.g., "USDC") */
  assetSymbol?: string;
  /** Amount in human-readable format */
  amount?: string;
};

/**
 * Track when user initiates a lend (deposit) operation.
 */
export function trackLendAttempt(params: LendEventParams): void {
  trackEvent("lend_attempt", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    asset_symbol: params.assetSymbol,
    amount: params.amount,
  });
}

/**
 * Track when a lend (deposit) operation completes successfully.
 */
export function trackLendSuccess(
  params: LendEventParams & { txHash: string }
): void {
  trackEvent("lend_success", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    asset_symbol: params.assetSymbol,
    amount: params.amount,
    tx_hash: params.txHash,
  });
}

/**
 * Track when a lend (deposit) operation fails.
 */
export function trackLendError(
  params: LendEventParams & { errorMessage: string }
): void {
  trackEvent("lend_error", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    asset_symbol: params.assetSymbol,
    amount: params.amount,
    error_message: params.errorMessage,
  });
}

// ============================================================================
// Withdraw Flow Events
// ============================================================================

export type WithdrawEventParams = {
  /** Vault contract address */
  vaultAddress: string;
  /** Chain ID */
  chainId: number;
  /** Asset symbol (e.g., "USDC") */
  assetSymbol?: string;
  /** Amount in human-readable format */
  amount?: string;
};

/**
 * Track when user initiates a withdraw operation.
 */
export function trackWithdrawAttempt(params: WithdrawEventParams): void {
  trackEvent("withdraw_attempt", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    asset_symbol: params.assetSymbol,
    amount: params.amount,
  });
}

/**
 * Track when a withdraw operation completes successfully.
 */
export function trackWithdrawSuccess(
  params: WithdrawEventParams & { txHash: string }
): void {
  trackEvent("withdraw_success", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    asset_symbol: params.assetSymbol,
    amount: params.amount,
    tx_hash: params.txHash,
  });
}

/**
 * Track when a withdraw operation fails.
 */
export function trackWithdrawError(
  params: WithdrawEventParams & { errorMessage: string }
): void {
  trackEvent("withdraw_error", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    asset_symbol: params.assetSymbol,
    amount: params.amount,
    error_message: params.errorMessage,
  });
}

// ============================================================================
// Borrow Flow Events
// ============================================================================

export type BorrowEventParams = {
  /** Vault contract address */
  vaultAddress: string;
  /** Chain ID */
  chainId: number;
  /** Strategy ID */
  strategyId?: string;
  /** Asset symbol (e.g., "USDC") */
  assetSymbol?: string;
  /** Collateral amount in human-readable format */
  collateralAmount?: string;
  /** Borrow amount in human-readable format */
  borrowAmount?: string;
};

/**
 * Track when user initiates a borrow operation.
 */
export function trackBorrowAttempt(params: BorrowEventParams): void {
  trackEvent("borrow_attempt", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    strategy_id: params.strategyId,
    asset_symbol: params.assetSymbol,
    collateral_amount: params.collateralAmount,
    borrow_amount: params.borrowAmount,
  });
}

/**
 * Track when a borrow operation completes successfully.
 */
export function trackBorrowSuccess(
  params: BorrowEventParams & { txHash: string }
): void {
  trackEvent("borrow_success", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    strategy_id: params.strategyId,
    asset_symbol: params.assetSymbol,
    collateral_amount: params.collateralAmount,
    borrow_amount: params.borrowAmount,
    tx_hash: params.txHash,
  });
}

/**
 * Track when a borrow operation fails.
 */
export function trackBorrowError(
  params: BorrowEventParams & { errorMessage: string }
): void {
  trackEvent("borrow_error", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    strategy_id: params.strategyId,
    asset_symbol: params.assetSymbol,
    collateral_amount: params.collateralAmount,
    borrow_amount: params.borrowAmount,
    error_message: params.errorMessage,
  });
}

// ============================================================================
// Cancel Borrow (Unborrow) Flow Events
// ============================================================================

export type CancelBorrowEventParams = {
  /** Vault contract address */
  vaultAddress: string;
  /** Chain ID */
  chainId: number;
  /** Position ID */
  positionId?: string;
};

/**
 * Track when user initiates a cancel borrow (unborrow) operation.
 */
export function trackCancelBorrowAttempt(params: CancelBorrowEventParams): void {
  trackEvent("cancel_borrow_attempt", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    position_id: params.positionId,
  });
}

/**
 * Track when a cancel borrow (unborrow) operation completes successfully.
 */
export function trackCancelBorrowSuccess(
  params: CancelBorrowEventParams & { txHash: string }
): void {
  trackEvent("cancel_borrow_success", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    position_id: params.positionId,
    tx_hash: params.txHash,
  });
}

/**
 * Track when a cancel borrow (unborrow) operation fails.
 */
export function trackCancelBorrowError(
  params: CancelBorrowEventParams & { errorMessage: string }
): void {
  trackEvent("cancel_borrow_error", {
    vault_address: params.vaultAddress,
    chain_id: params.chainId,
    position_id: params.positionId,
    error_message: params.errorMessage,
  });
}
