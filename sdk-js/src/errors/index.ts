import { SdkErrorCode } from "./codes";
import type { SdkErrorJSON } from "./types";
import { version } from "../version";

type ErrorOptions = {
  userMessage?: string;
  cause?: unknown;
  context?: Record<string, unknown>;
};

export class SdkError extends Error {
  readonly code: SdkErrorCode;
  readonly userMessage?: string;
  readonly cause?: unknown;
  readonly version: string;
  readonly context?: Record<string, unknown>;

  constructor(code: SdkErrorCode, message: string, opts?: ErrorOptions) {
    super(message);

    this.name = this.constructor.name;
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
  constructor(ctx?: Record<string, unknown>) {
    super(
      SdkErrorCode.ADDRESS_NOT_FOUND,
      "Contract address is not configured for this chain.",
      { userMessage: "This network is not yet supported.", context: ctx }
    );
  }
}

export class InvalidAddressError extends SdkError {
  constructor(addr: string, ctx?: Record<string, unknown>) {
    super(SdkErrorCode.INVALID_ADDRESS, `Invalid address provided: ${addr}`, {
      userMessage: "Invalid contract address configuration.",
      context: { address: addr, ...ctx },
    });
  }
}
