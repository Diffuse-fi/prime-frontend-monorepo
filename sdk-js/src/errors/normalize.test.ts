import { describe, it, expect } from "vitest";
import { normalizeError } from "./normalize";
import { UserRejectedError } from "./errors";
import {
  UserRejectedRequestError,
  InsufficientFundsError as ViemInsufficientFunds,
  ContractFunctionRevertedError,
  RpcRequestError,
  HttpRequestError,
  BaseError,
} from "viem";
import { SdkErrorCode } from "./codes";

describe("normalizeError", () => {
  it("returns SdkError unchanged", () => {
    const err = new UserRejectedError();

    const result = normalizeError(err);

    expect(result).toBe(err);
  });

  it("detects abort by name", () => {
    const err = new Error("Some error");
    err.name = "AbortError";

    const result = normalizeError(err);

    expect(result.name).toBe("AbortedError");
    expect(result.code).toBe(SdkErrorCode.ABORTED);
  });

  it("detects user rejection from message", () => {
    const err = new Error("user rejected the transaction");

    const result = normalizeError(err);

    expect(result.name).toBe("UserRejectedError");
    expect(result.code).toBe(SdkErrorCode.USER_REJECTED);
  });

  it("detects UserRejectedRequestError from viem", () => {
    const err = new UserRejectedRequestError(new Error("User rejected"));

    const result = normalizeError(err);

    expect(result.name).toBe("UserRejectedError");
    expect(result.code).toBe(SdkErrorCode.USER_REJECTED);
  });

  it("detects insufficient funds from viem", () => {
    const err = new ViemInsufficientFunds({
      cause: new BaseError("Not enough funds"),
    });

    const result = normalizeError(err);

    expect(result.name).toBe("InsufficientFundsError");
    expect(result.code).toBe(SdkErrorCode.INSUFFICIENT_FUNDS);
  });

  it("detects contract revert error", () => {
    const err = new ContractFunctionRevertedError({
      abi: [],
      functionName: "transfer",
      data: "0x",
      message: "Insufficient balance",
    });

    const result = normalizeError(err);

    expect(result.name).toBe("SimulationRevertedError");
    expect(result.code).toBe(SdkErrorCode.SIMULATION_REVERTED);
  });

  it("detects RPC error", () => {
    const err = new RpcRequestError({
      body: {},
      url: "http://localhost:8545",
      error: {
        code: -32603,
        message: "Internal error",
      },
    });
    err.shortMessage = "Internal error";

    const result = normalizeError(err);

    expect(result.name).toBe("RpcError");
    expect(result.code).toBe(SdkErrorCode.RPC_ERROR);
  });

  it("detects network error", () => {
    const err = new HttpRequestError({
      url: "https://example.com",
      details: "Connection failed",
    });
    err.shortMessage = "Connection failed";

    const result = normalizeError(err);

    expect(result.name).toBe("NetworkError");
    expect(result.code).toBe(SdkErrorCode.NETWORK_ERROR);
  });

  it("wraps unknown errors", () => {
    const err = new Error("Something went wrong");

    const result = normalizeError(err);

    expect(result.name).toBe("UnknownError");
    expect(result.code).toBe(SdkErrorCode.UNKNOWN);
  });

  it("handles circular references without infinite loop", () => {
    const err1: any = new Error("Error 1");
    const err2: any = new Error("Error 2");
    err1.cause = err2;
    err2.cause = err1;

    const result = normalizeError(err1);

    expect(result.name).toBe("UnknownError");
    expect(result.code).toBe(SdkErrorCode.UNKNOWN);
  });
});
