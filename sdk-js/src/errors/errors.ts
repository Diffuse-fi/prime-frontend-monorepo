import { SdkErrorCode } from "./codes";
import type { ErrorCtx, SdkErrorJSON } from "./types";
import { version } from "../version";

type ErrorOptions = {
  name?: string;
  userMessage?: string;
  cause?: unknown;
  context?: ErrorCtx;
};

export class SdkError extends Error {
  readonly code: SdkErrorCode;
  readonly userMessage?: string;
  readonly cause?: unknown;
  readonly version: string;
  readonly context?: ErrorCtx;

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
      name: this.name,
      message: this.message,
      code: this.code,
      userMessage: this.userMessage,
      stack: this.stack,
      version: this.version,
      context: this.context,
      cause:
        this.cause && typeof this.cause === "object"
          ? {
              name: (this.cause as Error).name,
              message: (this.cause as Error).message,
              stack: (this.cause as Error).stack,
            }
          : undefined,
    };
  }
}

export class AddressNotFoundError extends SdkError {
  constructor(ctx?: ErrorCtx) {
    super(
      SdkErrorCode.ADDRESS_NOT_FOUND,
      "Contract address is not configured for this chain.",
      {
        userMessage: "Contract address not found.",
        context: ctx,
        name: "AddressNotFoundError",
      }
    );
  }
}

export class InvalidAddressError extends SdkError {
  constructor(addr: string, ctx?: ErrorCtx) {
    super(SdkErrorCode.INVALID_ADDRESS, `Invalid address provided: ${addr}`, {
      userMessage: "Invalid contract address configuration.",
      context: { address: addr, ...ctx },
      name: "InvalidAddressError",
    });
  }
}

export class WalletRequiredError extends SdkError {
  constructor(op?: string) {
    super(
      SdkErrorCode.WALLET_REQUIRED,
      `Wallet client is required${op ? ` for ${op}` : ""}.`,
      {
        userMessage: "Connect a wallet to continue.",
        context: { operation: op },
        name: "WalletRequiredError",
      }
    );
  }
}

export class UserRejectedError extends SdkError {
  constructor(ctx?: ErrorCtx, cause?: unknown) {
    super(SdkErrorCode.USER_REJECTED, "User rejected the request.", {
      userMessage: "Request rejected in wallet.",
      context: ctx,
      cause,
      name: "UserRejectedError",
    });
  }
}

export class InsufficientFundsError extends SdkError {
  constructor(ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for gas or value.", {
      userMessage: "Insufficient funds for gas.",
      context: ctx,
      cause,
      name: "InsufficientFundsError",
    });
  }
}

export class SimulationRevertedError extends SdkError {
  constructor(details?: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.SIMULATION_REVERTED, details ?? "Transaction would revert.", {
      userMessage: "This action would fail (simulation).",
      context: ctx,
      cause,
      name: "SimulationRevertedError",
    });
  }
}

export class ContractRevertError extends SdkError {
  constructor(details?: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.CONTRACT_REVERTED, details ?? "Transaction failed.", {
      userMessage: "Transaction reverted on-chain.",
      context: ctx,
      cause,
      name: "ContractRevertError",
    });
  }
}

export class RpcError extends SdkError {
  constructor(message: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.RPC_ERROR, message, {
      userMessage: "RPC error. Please retry.",
      context: ctx,
      cause,
      name: "RpcError",
    });
  }
}

export class NetworkError extends SdkError {
  constructor(message: string, ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.NETWORK_ERROR, message, {
      userMessage: "Network error. Check your connection.",
      context: ctx,
      cause,
      name: "NetworkError",
    });
  }
}

export class UnknownError extends SdkError {
  constructor(ctx?: Record<string, unknown>, cause?: unknown) {
    super(SdkErrorCode.UNKNOWN, "Unknown error.", {
      userMessage: "Something went wrong.",
      context: ctx,
      cause,
      name: "UnknownError",
    });
  }
}

export class AbortedError extends SdkError {
  constructor(ctx?: Record<string, unknown>) {
    super(SdkErrorCode.ABORTED, "Operation was aborted.", {
      userMessage: "Operation aborted.",
      context: ctx,
      name: "AbortedError",
    });
  }
}
