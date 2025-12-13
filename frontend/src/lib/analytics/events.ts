"use client";

import { sendGAEvent } from "@next/third-parties/google";

/**
 * GA4 Event Names
 * Comprehensive list of all trackable user interactions in the app
 */
export type EventName =
  // Borrow Events
  | "borrow_add_collateral_error"
  | "borrow_add_collateral_rejected"
  | "borrow_add_collateral_start"
  | "borrow_add_collateral_success"
  | "borrow_approve_error"
  | "borrow_approve_rejected"
  | "borrow_approve_start"
  | "borrow_approve_success"
  | "borrow_cancel_error"
  | "borrow_cancel_rejected"
  | "borrow_cancel_start"
  | "borrow_cancel_success"
  | "borrow_repay_error"
  | "borrow_repay_rejected"
  | "borrow_repay_start"
  | "borrow_repay_success"
  | "borrow_request_error"
  | "borrow_request_rejected"
  | "borrow_request_start"
  | "borrow_request_success"
  // Chain Events
  | "chain_switch"
  | "chain_switch_error"
  | "chain_switch_modal_open"
  // Lend Events
  | "lend_approve_error"
  | "lend_approve_rejected"
  | "lend_approve_start"
  | "lend_approve_success"
  | "lend_deposit_error"
  | "lend_deposit_rejected"
  | "lend_deposit_start"
  | "lend_deposit_success"
  | "lend_withdraw_error"
  | "lend_withdraw_rejected"
  | "lend_withdraw_start"
  | "lend_withdraw_success"
  | "lend_yield_withdraw_error"
  | "lend_yield_withdraw_rejected"
  | "lend_yield_withdraw_start"
  | "lend_yield_withdraw_success"
  // Modal Events
  | "modal_close"
  | "modal_open_borrow"
  | "modal_open_manage_position"
  | "modal_open_withdraw"
  // Page Views
  | "page_view_borrow"
  | "page_view_home"
  | "page_view_lend"
  | "page_view_my_positions_borrow"
  | "page_view_my_positions_lend"
  // Position Events
  | "position_close_error"
  | "position_close_rejected"
  | "position_close_start"
  | "position_close_success"
  | "position_view"
  // Wallet Events
  | "wallet_account_modal_open"
  | "wallet_connect"
  | "wallet_connect_error"
  | "wallet_disconnect";

/**
 * GA4 Event Parameters
 * Additional metadata that can be sent with events
 */
export interface EventParams {
  // Other custom parameters
  [key: string]: boolean | number | string | undefined;
  
  // Amount parameters
  amount?: string;
  amount_usd?: number;
  
  // Common parameters
  asset_symbol?: string;
  chain_id?: number;
  error_code?: string;
  error_message?: string;
  
  // Position parameters
  leverage?: number;
  
  // Modal parameters
  modal_name?: string;
  position_id?: string;
  transaction_hash?: string;
  value?: number | string;
  vault_address?: string;
}

/**
 * Track a GA4 event
 * 
 * @param name - The event name from the EventName type
 * @param params - Optional event parameters
 * 
 * @example
 * trackEvent('wallet_connect', { chain_id: 1 });
 * trackEvent('lend_deposit_success', { 
 *   asset_symbol: 'USDC',
 *   amount: '1000',
 *   transaction_hash: '0x...',
 *   chain_id: 1
 * });
 */
export function trackEvent(name: EventName, params?: EventParams): void {
  try {
    // Only track if tracking is enabled
    if (globalThis.window === undefined) {
      return;
    }

    sendGAEvent("event", name, params ?? {});
  } catch (error) {
    // Silently fail to avoid breaking the app
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to track event:", name, params, error);
    }
  }
}

/**
 * Track a page view event
 * 
 * @param path - The page path
 * @param title - Optional page title
 * 
 * @example
 * trackPageView('/lend', 'Lend Page');
 */
export function trackPageView(path: string, title?: string): void {
  // Map path to appropriate event name
  let eventName: EventName = "page_view_home";
  
  if (path.includes("/lend/my-positions")) {
    eventName = "page_view_my_positions_lend";
  } else if (path.includes("/lend")) {
    eventName = "page_view_lend";
  } else if (path.includes("/borrow/my-positions")) {
    eventName = "page_view_my_positions_borrow";
  } else if (path.includes("/borrow")) {
    eventName = "page_view_borrow";
  }
  
  trackEvent(eventName, { modal_name: title, value: path });
}
