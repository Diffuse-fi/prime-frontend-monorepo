import type { ErrorCtx, SdkErrorJSON } from "./types";

import { version } from "../version";
import { SdkErrorCode } from "./codes";

type ErrorOptions = {
  cause?: unknown;
  context?: ErrorCtx;
  name?: string;
  userMessage?: string;
};

export class SdkError extends Error {
  readonly cause?: unknown;
  readonly code: SdkErrorCode;
  readonly context?: ErrorCtx;
  readonly userMessage?: string;
  readonly version: string;

  constructor(code: SdkErrorCode, message: string, opts?: ErrorOptions) {
    super(message);

    this.name = opts?.name ?? this.constructor.name ?? "SdkError";
    this.code = code;
    this.userMessage = opts?.userMessage;
    this.cause = opts?.cause;
    this.version = version;
    this.context = opts?.context;

    Object.setPrototypeOf(this, SdkError.prototype);
  }

  toJSON(): SdkErrorJSON {
    return {
      cause:
        this.cause && typeof this.cause === "object"
          ? {
              message: (this.cause as Error).message,
              name: (this.cause as Error).name,
              stack: (this.cause as Error).stack,
            }
          : undefined,
      code: this.code,
      context: this.context,
      message: this.message,
      name: this.name,
      stack: this.stack,
      userMessage: this.userMessage,
      version: this.version,
    };
  }
}

export class AbiItemNotFoundError extends SdkError {
  constructor(itemName: string, ctx?: ErrorCtx) {
    super(SdkErrorCode.ABI_ITEM_NOT_FOUND, `ABI item "${itemName}" not found in ABI.`, {
      context: ctx,
      name: "AbiItemNotFoundError",
      userMessage: `ABI item "${itemName}" not found.`,
    });
  }
}

export class AbortedError extends SdkError {
  constructor(ctx?: Record<string, unknown>) {
    super(SdkErrorCode.ABORTED, "Operation was aborted.", {
      context: ctx,
      name: "AbortedError",
      userMessage: "Operation aborted.",
    });
  }
}

export class AddressNotFoundError extends SdkError {
  constructor(ctx?: ErrorCtx) {
    super(
      SdkErrorCode.ADDRESS_NOT_FOUND,
      "Contract address is not configured for this chain.",
      {
        context: ctx,
        name: "AddressNotFoundError",
        userMessage: "Contract address not found.",
      }
    );
  }
}

export class ContractRevertError extends SdkError {
  constructor(details?: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.CONTRACT_REVERTED, details ?? "Transaction failed.", {
      cause,
      context: ctx,
      name: "ContractRevertError",
      userMessage: "Transaction reverted on-chain.",
    });
  }
}

export class InsufficientFundsError extends SdkError {
  constructor(ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for gas or value.", {
      cause,
      context: ctx,
      name: "InsufficientFundsError",
      userMessage: "Insufficient funds for gas.",
    });
  }
}

export class InvalidAddressError extends SdkError {
  constructor(addr: string, ctx?: ErrorCtx) {
    super(SdkErrorCode.INVALID_ADDRESS, `Invalid address provided: ${addr}`, {
      context: { address: addr, ...ctx },
      name: "InvalidAddressError",
      userMessage: "Invalid contract address configuration.",
    });
  }
}

export class NetworkError extends SdkError {
  constructor(message: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.NETWORK_ERROR, message, {
      cause,
      context: ctx,
      name: "NetworkError",
      userMessage: "Network error. Check your connection.",
    });
  }
}

export class RpcError extends SdkError {
  constructor(message: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.RPC_ERROR, message, {
      cause,
      context: ctx,
      name: "RpcError",
      userMessage: "RPC error. Please retry.",
    });
  }
}

export class SimulationRevertedError extends SdkError {
  constructor(details?: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.SIMULATION_REVERTED, details ?? "Transaction would revert.", {
      cause,
      context: ctx,
      name: "SimulationRevertedError",
      userMessage: "This action would fail (simulation).",
    });
  }
}

export class UnknownError extends SdkError {
  constructor(ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.UNKNOWN, "Unknown error.", {
      cause,
      context: ctx,
      name: "UnknownError",
      userMessage: "Something went wrong.",
    });
  }
}

export class UserRejectedError extends SdkError {
  constructor(ctx?: ErrorCtx, cause?: unknown) {
    super(SdkErrorCode.USER_REJECTED, "User rejected the request.", {
      cause,
      context: ctx,
      name: "UserRejectedError",
      userMessage: "Request rejected in wallet.",
    });
  }
}

export class WalletRequiredError extends SdkError {
  constructor(op?: string) {
    super(
      SdkErrorCode.WALLET_REQUIRED,
      `Wallet client is required${op ? ` for ${op}` : ""}.`,
      {
        context: { operation: op },
        name: "WalletRequiredError",
        userMessage: "Connect a wallet to continue.",
      }
    );
  }
}
