import { describe, it, expect } from "vitest";
import { version as pkgVersion } from "../version";
import { SdkErrorCode } from "./codes";
import {
  SdkError,
  AddressNotFoundError,
  InvalidAddressError,
  WalletRequiredError,
  UserRejectedError,
  InsufficientFundsError,
  SimulationRevertedError,
  ContractRevertError,
  RpcError,
  NetworkError,
  UnknownError,
  AbortedError,
  AbiItemNotFoundError,
} from "./errors";

describe("SdkError", () => {
  it("sets all properties and serializes with object cause", () => {
    const cause = new Error("inner");
    const context = { op: "test" };

    const err = new SdkError(SdkErrorCode.UNKNOWN, "outer", {
      userMessage: "User friendly",
      cause,
      context,
    });

    expect(err.name).toBe("SdkError");
    expect(err.code).toBe(SdkErrorCode.UNKNOWN);
    expect(err.userMessage).toBe("User friendly");
    expect(err.cause).toBe(cause);
    expect(err.context).toBe(context);
    expect(err.version).toBe(pkgVersion);

    const json = err.toJSON();

    expect(json.name).toBe("SdkError");
    expect(json.message).toBe("outer");
    expect(json.code).toBe(SdkErrorCode.UNKNOWN);
    expect(json.userMessage).toBe("User friendly");
    expect(json.version).toBe(pkgVersion);
    expect(json.context).toBe(context);
    expect(json.stack).toBeTypeOf("string");
    expect(json.cause).toEqual({
      name: cause.name,
      message: cause.message,
      stack: cause.stack,
    });
  });

  it("omits non-object cause in JSON", () => {
    const err = new SdkError(SdkErrorCode.UNKNOWN, "msg", {
      cause: "raw cause" as any,
    });

    const json = err.toJSON();

    expect(json.cause).toBeUndefined();
  });

  it("uses custom name when provided", () => {
    const err = new SdkError(SdkErrorCode.UNKNOWN, "msg", {
      name: "CustomError",
    });

    expect(err.name).toBe("CustomError");
    expect(err.toJSON().name).toBe("CustomError");
  });
});

describe("Error subclasses", () => {
  it("creates AddressNotFoundError with context", () => {
    const ctx = { chainId: 1 };
    const err = new AddressNotFoundError(ctx);

    expect(err.name).toBe("AddressNotFoundError");
    expect(err.code).toBe(SdkErrorCode.ADDRESS_NOT_FOUND);
    expect(err.userMessage).toBe("Contract address not found.");
    expect(err.context).toBe(ctx);
  });

  it("creates InvalidAddressError and merges address into context", () => {
    const ctx = { chainId: 1 };
    const addr = "0x1234";
    const err = new InvalidAddressError(addr, ctx);

    expect(err.name).toBe("InvalidAddressError");
    expect(err.code).toBe(SdkErrorCode.INVALID_ADDRESS);
    expect(err.userMessage).toBe("Invalid contract address configuration.");
    expect(err.context).toEqual({ address: addr, ...ctx });
  });

  it("creates WalletRequiredError without operation", () => {
    const err = new WalletRequiredError();

    expect(err.name).toBe("WalletRequiredError");
    expect(err.code).toBe(SdkErrorCode.WALLET_REQUIRED);
    expect(err.message).toBe("Wallet client is required.");
    expect(err.context).toEqual({ operation: undefined });
  });

  it("creates WalletRequiredError with operation", () => {
    const err = new WalletRequiredError("borrow");

    expect(err.name).toBe("WalletRequiredError");
    expect(err.message).toBe("Wallet client is required for borrow.");
    expect(err.context).toEqual({ operation: "borrow" });
  });

  it("creates UserRejectedError with cause", () => {
    const cause = new Error("wallet reject");
    const ctx = { op: "sign" };
    const err = new UserRejectedError(ctx, cause);

    expect(err.name).toBe("UserRejectedError");
    expect(err.code).toBe(SdkErrorCode.USER_REJECTED);
    expect(err.userMessage).toBe("Request rejected in wallet.");
    expect(err.context).toBe(ctx);
    expect(err.cause).toBe(cause);
  });

  it("creates InsufficientFundsError", () => {
    const ctx = { required: "0.1" };
    const err = new InsufficientFundsError(ctx);

    expect(err.name).toBe("InsufficientFundsError");
    expect(err.code).toBe(SdkErrorCode.INSUFFICIENT_FUNDS);
    expect(err.userMessage).toBe("Insufficient funds for gas.");
    expect(err.context).toBe(ctx);
  });

  it("creates SimulationRevertedError with custom details", () => {
    const ctx = { op: "simulate" };
    const err = new SimulationRevertedError("Custom reason", ctx);

    expect(err.name).toBe("SimulationRevertedError");
    expect(err.code).toBe(SdkErrorCode.SIMULATION_REVERTED);
    expect(err.message).toBe("Custom reason");
    expect(err.userMessage).toBe("This action would fail (simulation).");
    expect(err.context).toBe(ctx);
  });

  it("creates SimulationRevertedError with default message", () => {
    const err = new SimulationRevertedError();

    expect(err.message).toBe("Transaction would revert.");
  });

  it("creates ContractRevertError with default message", () => {
    const err = new ContractRevertError();

    expect(err.name).toBe("ContractRevertError");
    expect(err.code).toBe(SdkErrorCode.CONTRACT_REVERTED);
    expect(err.message).toBe("Transaction failed.");
  });

  it("creates RpcError", () => {
    const ctx = { endpoint: "http://localhost:8545" };
    const err = new RpcError("RPC failed", ctx);

    expect(err.name).toBe("RpcError");
    expect(err.code).toBe(SdkErrorCode.RPC_ERROR);
    expect(err.userMessage).toBe("RPC error. Please retry.");
    expect(err.context).toBe(ctx);
  });

  it("creates NetworkError", () => {
    const ctx = { url: "https://example.com" };
    const err = new NetworkError("Network down", ctx);

    expect(err.name).toBe("NetworkError");
    expect(err.code).toBe(SdkErrorCode.NETWORK_ERROR);
    expect(err.userMessage).toBe("Network error. Check your connection.");
    expect(err.context).toBe(ctx);
  });

  it("creates UnknownError", () => {
    const ctx = { foo: "bar" };
    const cause = new Error("weird");
    const err = new UnknownError(ctx, cause);

    expect(err.name).toBe("UnknownError");
    expect(err.code).toBe(SdkErrorCode.UNKNOWN);
    expect(err.userMessage).toBe("Something went wrong.");
    expect(err.context).toBe(ctx);
    expect(err.cause).toBe(cause);
  });

  it("creates AbortedError", () => {
    const ctx = { op: "fetch" };
    const err = new AbortedError(ctx);

    expect(err.name).toBe("AbortedError");
    expect(err.code).toBe(SdkErrorCode.ABORTED);
    expect(err.userMessage).toBe("Operation aborted.");
    expect(err.context).toBe(ctx);
  });

  it("creates AbiItemNotFoundError", () => {
    const ctx = { contract: "Viewer" };
    const err = new AbiItemNotFoundError("getVaults", ctx);

    expect(err.name).toBe("AbiItemNotFoundError");
    expect(err.code).toBe(SdkErrorCode.ABI_ITEM_NOT_FOUND);
    expect(err.userMessage).toBe('ABI item "getVaults" not found.');
    expect(err.message).toBe('ABI item "getVaults" not found in ABI.');
    expect(err.context).toBe(ctx);
  });
});
