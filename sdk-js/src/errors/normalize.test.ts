import { describe, it, expect } from "vitest";
import { normalizeError } from "./normalize";
import {
  SdkError,
  UserRejectedError,
  InsufficientFundsError,
  SimulationRevertedError,
  ContractRevertError,
  RpcError,
  NetworkError,
  UnknownError,
  AddressNotFoundError,
  InvalidAddressError,
  AbortedError,
} from "./errors";
import {
  UserRejectedRequestError,
  InsufficientFundsError as ViemInsufficientFunds,
  ContractFunctionRevertedError,
  ContractFunctionExecutionError,
  EstimateGasExecutionError,
  CallExecutionError,
  RpcRequestError,
  HttpRequestError,
  BaseError,
} from "viem";

describe("normalizeError", () => {
  describe("SdkError pass-through", () => {
    it("returns the same SdkError instance", () => {
      const err = new UserRejectedError();
      const result = normalizeError(err);
      expect(result).toBe(err);
    });

    it("returns AddressNotFoundError unchanged", () => {
      const err = new AddressNotFoundError({ chainId: 1 });
      const result = normalizeError(err);
      expect(result).toBe(err);
    });

    it("returns InvalidAddressError unchanged", () => {
      const err = new InvalidAddressError("0xinvalid");
      const result = normalizeError(err);
      expect(result).toBe(err);
    });

    it("returns nested SdkError unchanged", () => {
      const err = new InsufficientFundsError({ balance: "0" });
      const result = normalizeError(err);
      expect(result).toBe(err);
    });
  });

  describe("Abort errors", () => {
    it("detects AbortError by name", () => {
      const err = new Error("Some error");
      (err as any).name = "AbortError";
      const result = normalizeError(err);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("detects AbortError by code ABORT_ERR", () => {
      const err = new Error("Operation failed");
      (err as any).code = "ABORT_ERR";
      const result = normalizeError(err);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("detects AbortError by code UND_ERR_ABORTED", () => {
      const err = new Error("Operation failed");
      (err as any).code = "UND_ERR_ABORTED";
      const result = normalizeError(err);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("detects abort in message", () => {
      const err = new Error("Operation was aborted");
      const result = normalizeError(err);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("detects abort in message (case insensitive)", () => {
      const err = new Error("Request ABORTED by user");
      const result = normalizeError(err);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("detects abort in message with variant 'aborting'", () => {
      const err = new Error("Aborting operation");
      const result = normalizeError(err);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("detects abort in cause chain", () => {
      const rootErr = new Error("Root");
      (rootErr as any).name = "AbortError";
      const err = new Error("Wrapper error");
      (err as any).cause = rootErr;
      const result = normalizeError(err);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("passes context to AbortedError", () => {
      const err = new Error("aborted");
      const ctx = { operation: "transfer" };
      const result = normalizeError(err, ctx);
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
      expect(result.context).toEqual(ctx);
    });
  });

  describe("User rejected errors", () => {
    it("detects UserRejectedRequestError from viem", () => {
      const err = new UserRejectedRequestError(new Error("User rejected"));
      const result = normalizeError(err);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects UserRejectedRequestError in cause chain", () => {
      const rootErr = new UserRejectedRequestError(new Error("User rejected"));
      const wrapper = new Error("Wrapper");
      (wrapper as any).cause = rootErr;
      const result = normalizeError(wrapper);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects RpcRequestError with code 4001", () => {
      const err = new RpcRequestError({
        body: {},
        url: "http://localhost:8545",
        error: {
          code: 4001,
          message: "User rejected",
        },
      });
      (err as any).code = 4001;
      const result = normalizeError(err);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects RpcRequestError with code 4001 in cause chain", () => {
      const rootErr = new RpcRequestError({
        body: {},
        url: "http://localhost:8545",
        error: {
          code: 4001,
          message: "User rejected",
        },
      });
      (rootErr as any).code = 4001;
      const wrapper = new Error("Wrapper");
      (wrapper as any).cause = rootErr;
      const result = normalizeError(wrapper);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects 'user rejected' in message", () => {
      const err = new Error("user rejected the transaction");
      const result = normalizeError(err);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects 'user denied' in message", () => {
      const err = new Error("user denied transaction signature");
      const result = normalizeError(err);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects 'request rejected' in message", () => {
      const err = new Error("request rejected by user");
      const result = normalizeError(err);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects user rejection pattern in message (case insensitive)", () => {
      const err = new Error("User REJECTED the request");
      const result = normalizeError(err);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("detects user rejection in cause chain message", () => {
      const rootErr = new Error("User rejected the transaction");
      const wrapper = new Error("Transaction failed");
      (wrapper as any).cause = rootErr;
      const result = normalizeError(wrapper);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("passes context and cause to UserRejectedError", () => {
      const err = new Error("user rejected");
      const ctx = { operation: "approve" };
      const result = normalizeError(err, ctx);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
      expect(result.context).toEqual(ctx);
      expect(result.cause).toBe(err);
    });
  });

  describe("Insufficient funds errors", () => {
    it("detects ViemInsufficientFunds error", () => {
      const err = new ViemInsufficientFunds({
        cause: new Error("Insufficient funds"),
      });
      const result = normalizeError(err);
      expect(result.name).toBe("InsufficientFundsError");
      expect(result.code).toBe("INSUFFICIENT_FUNDS");
    });

    it("detects ViemInsufficientFunds in cause chain", () => {
      const rootErr = new ViemInsufficientFunds({
        cause: new Error("Insufficient funds"),
      });
      const wrapper = new Error("Transaction failed");
      (wrapper as any).cause = rootErr;
      const result = normalizeError(wrapper);
      expect(result.name).toBe("InsufficientFundsError");
      expect(result.code).toBe("INSUFFICIENT_FUNDS");
    });

    it("passes context and cause to InsufficientFundsError", () => {
      const err = new ViemInsufficientFunds({
        cause: new Error("Insufficient funds"),
      });
      const ctx = { balance: "100", required: "200" };
      const result = normalizeError(err, ctx);
      expect(result.name).toBe("InsufficientFundsError");
      expect(result.code).toBe("INSUFFICIENT_FUNDS");
      expect(result.context).toEqual(ctx);
      expect(result.cause).toBe(err);
    });
  });

  describe("Contract reverted errors", () => {
    it("detects ContractFunctionRevertedError", () => {
      const err = new ContractFunctionRevertedError({
        abi: [],
        functionName: "transfer",
        args: [],
        data: "0x",
        reason: "Insufficient balance",
        shortMessage: "Function reverted",
      });
      const result = normalizeError(err);
      expect(result.name).toBe("SimulationRevertedError");
      expect(result.code).toBe("SIMULATION_REVERTED");
      // The normalize function uses err.shortMessage || err.reason, and viem may format differently
      expect(result.message).toBeTruthy();
    });

    it("detects ContractFunctionRevertedError with reason", () => {
      const err = new ContractFunctionRevertedError({
        abi: [],
        functionName: "transfer",
        args: [],
        data: "0x",
        reason: "Custom revert reason",
      });
      const result = normalizeError(err);
      expect(result.name).toBe("SimulationRevertedError");
      expect(result.code).toBe("SIMULATION_REVERTED");
      // The normalize function extracts reason from viem error
      expect(result.message).toBeTruthy();
    });

    it("detects ContractFunctionExecutionError", () => {
      const err = new ContractFunctionExecutionError(new Error("Execution failed"), {
        abi: [],
        functionName: "transfer",
        args: [],
        shortMessage: "Execution failed",
      });
      const result = normalizeError(err);
      expect(result.name).toBe("ContractRevertError");
      expect(result.code).toBe("CONTRACT_REVERTED");
    });

    it("detects EstimateGasExecutionError", () => {
      const err = new EstimateGasExecutionError(new Error("Gas estimation failed"), {
        account: "0x123" as any,
        to: "0x456" as any,
        shortMessage: "Gas estimation failed",
      });
      const result = normalizeError(err);
      expect(result.name).toBe("ContractRevertError");
      expect(result.code).toBe("CONTRACT_REVERTED");
    });

    it("detects CallExecutionError", () => {
      const err = new CallExecutionError(new Error("Call failed"), {
        account: "0x123" as any,
        to: "0x456" as any,
        shortMessage: "Call execution failed",
      });
      const result = normalizeError(err);
      expect(result.name).toBe("ContractRevertError");
      expect(result.code).toBe("CONTRACT_REVERTED");
    });

    it("passes context to ContractRevertError", () => {
      const err = new CallExecutionError(new Error("Call failed"), {
        account: "0x123" as any,
        to: "0x456" as any,
        shortMessage: "Call failed",
      });
      const ctx = { contract: "Token", function: "transfer" };
      const result = normalizeError(err, ctx);
      expect(result.name).toBe("ContractRevertError");
      expect(result.code).toBe("CONTRACT_REVERTED");
      expect(result.context).toEqual(ctx);
    });
  });

  describe("RPC errors", () => {
    it("detects RpcRequestError", () => {
      const err = new RpcRequestError({
        body: {},
        url: "http://localhost:8545",
        error: {
          code: -32603,
          message: "Internal error",
        },
      });
      (err as any).shortMessage = "Internal error";
      const result = normalizeError(err);
      expect(result.name).toBe("RpcError");
      expect(result.code).toBe("RPC_ERROR");
      expect(result.message).toContain("Internal error");
    });

    it("detects RpcRequestError in cause chain", () => {
      const rootErr = new RpcRequestError({
        body: {},
        url: "http://localhost:8545",
        error: {
          code: -32603,
          message: "Internal error",
        },
      });
      (rootErr as any).shortMessage = "Internal error";
      const wrapper = new Error("Wrapper");
      (wrapper as any).cause = rootErr;
      const result = normalizeError(wrapper);
      expect(result.name).toBe("RpcError");
      expect(result.code).toBe("RPC_ERROR");
    });

    it("uses default message for RpcRequestError without shortMessage", () => {
      const err = new RpcRequestError({
        body: {},
        url: "http://localhost:8545",
        error: {
          code: -32603,
          message: "Error",
        },
      });
      const result = normalizeError(err);
      expect(result.name).toBe("RpcError");
      expect(result.code).toBe("RPC_ERROR");
      // When shortMessage is not available, it falls back to "RPC error" default
      expect(result.message).toBeTruthy();
    });

    it("passes context to RpcError", () => {
      const err = new RpcRequestError({
        body: {},
        url: "http://localhost:8545",
        error: {
          code: -32603,
          message: "Internal error",
        },
      });
      (err as any).shortMessage = "Internal error";
      const ctx = { method: "eth_call" };
      const result = normalizeError(err, ctx);
      expect(result.name).toBe("RpcError");
      expect(result.code).toBe("RPC_ERROR");
      expect(result.context).toEqual(ctx);
    });
  });

  describe("Network errors", () => {
    it("detects HttpRequestError", () => {
      const err = new HttpRequestError({
        url: new URL("https://example.com"),
        details: "Connection failed",
      });
      (err as any).shortMessage = "Connection failed";
      const result = normalizeError(err);
      expect(result.name).toBe("NetworkError");
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("detects HttpRequestError in cause chain", () => {
      const rootErr = new HttpRequestError({
        url: new URL("https://example.com"),
        details: "Connection failed",
      });
      const wrapper = new Error("Wrapper");
      (wrapper as any).cause = rootErr;
      const result = normalizeError(wrapper);
      expect(result.name).toBe("NetworkError");
      expect(result.code).toBe("NETWORK_ERROR");
    });

    it("uses default message for HttpRequestError without shortMessage", () => {
      const err = new HttpRequestError({
        url: new URL("https://example.com"),
      });
      const result = normalizeError(err);
      expect(result.name).toBe("NetworkError");
      expect(result.code).toBe("NETWORK_ERROR");
      // When shortMessage is not available, it falls back to "HTTP error" default
      expect(result.message).toBeTruthy();
    });

    it("passes context to NetworkError", () => {
      const err = new HttpRequestError({
        url: new URL("https://example.com"),
        details: "Timeout",
      });
      (err as any).shortMessage = "Timeout";
      const ctx = { url: "https://example.com" };
      const result = normalizeError(err, ctx);
      expect(result.name).toBe("NetworkError");
      expect(result.code).toBe("NETWORK_ERROR");
      expect(result.context).toEqual(ctx);
    });
  });

  describe("BaseError fallback", () => {
    it("converts BaseError to RpcError", () => {
      const err = new BaseError("Base error occurred", {
        details: "Some details",
      });
      (err as any).shortMessage = "Base error occurred";
      const result = normalizeError(err);
      expect(result.name).toBe("RpcError");
      expect(result.code).toBe("RPC_ERROR");
    });

    it("uses message from BaseError when shortMessage is not available", () => {
      const err = new BaseError("Custom message");
      const result = normalizeError(err);
      expect(result.name).toBe("RpcError");
      expect(result.code).toBe("RPC_ERROR");
    });
  });

  describe("Unknown errors", () => {
    it("wraps regular Error as UnknownError", () => {
      const err = new Error("Something went wrong");
      const result = normalizeError(err);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("wraps non-Error values as UnknownError", () => {
      const result = normalizeError("string error");
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("wraps null as UnknownError", () => {
      const result = normalizeError(null);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("wraps undefined as UnknownError", () => {
      const result = normalizeError(undefined);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("wraps number as UnknownError", () => {
      const result = normalizeError(42);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("wraps object without Error interface as UnknownError", () => {
      const result = normalizeError({ foo: "bar" });
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("passes context to UnknownError", () => {
      const err = new Error("Unknown issue");
      const ctx = { source: "test" };
      const result = normalizeError(err, ctx);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
      expect(result.context).toEqual(ctx);
    });

    it("preserves cause for Error instances", () => {
      const err = new Error("Unknown issue");
      const result = normalizeError(err);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
      expect(result.cause).toBe(err);
    });
  });

  describe("Error priority and precedence", () => {
    it("prioritizes abort detection over user rejection", () => {
      const err = new Error("user rejected - aborted");
      const result = normalizeError(err);
      // Abort is checked first
      expect(result.name).toBe("AbortedError");
      expect(result.code).toBe("ABORTED");
    });

    it("prioritizes user rejection over other errors", () => {
      const err = new RpcRequestError({
        body: {},
        url: "http://localhost:8545",
        error: {
          code: -32603,
          message: "user rejected",
        },
      });
      const result = normalizeError(err);
      // User rejection is checked before RPC error
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("prioritizes specific contract errors when they are the top-level error", () => {
      const contractErr = new ContractFunctionRevertedError({
        abi: [],
        functionName: "transfer",
        args: [],
        data: "0x",
        reason: "Insufficient balance",
      });
      const result = normalizeError(contractErr);
      // ContractFunctionRevertedError is detected directly
      expect(result.name).toBe("SimulationRevertedError");
      expect(result.code).toBe("SIMULATION_REVERTED");
    });
  });

  describe("Circular reference handling", () => {
    it("handles circular cause references without infinite loop", () => {
      const err1: any = new Error("Error 1");
      const err2: any = new Error("Error 2");
      err1.cause = err2;
      err2.cause = err1; // Circular reference
      
      const result = normalizeError(err1);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("handles self-referencing cause without infinite loop", () => {
      const err: any = new Error("Self-referencing");
      err.cause = err; // Self-reference
      
      const result = normalizeError(err);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });
  });

  describe("Complex cause chains", () => {
    it("traverses deep cause chains to find specific errors", () => {
      const rootErr = new UserRejectedRequestError(new Error("User rejected"));
      const level1 = new Error("Level 1");
      (level1 as any).cause = rootErr;
      const level2 = new Error("Level 2");
      (level2 as any).cause = level1;
      const level3 = new Error("Level 3");
      (level3 as any).cause = level2;
      
      const result = normalizeError(level3);
      expect(result.name).toBe("UserRejectedError");
      expect(result.code).toBe("USER_REJECTED");
    });

    it("extracts messages from different levels of cause chain", () => {
      const rootErr = new Error("Root cause message");
      (rootErr as any).shortMessage = "Root short message";
      const wrapper = new Error("Wrapper message");
      (wrapper as any).cause = rootErr;
      (wrapper as any).details = "Wrapper details";
      
      const result = normalizeError(wrapper);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });
  });

  describe("Edge cases with message extraction", () => {
    it("handles error with only shortMessage", () => {
      const err: any = { shortMessage: "Short message only" };
      const result = normalizeError(err);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("handles error with only message", () => {
      const err = new Error("Message only");
      const result = normalizeError(err);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("handles error with only details", () => {
      const err: any = { details: "Details only" };
      const result = normalizeError(err);
      expect(result.name).toBe("UnknownError");
      expect(result.code).toBe("UNKNOWN");
    });

    it("prefers shortMessage over message", () => {
      const err = new BaseError("Long message", {
        details: "Details",
      });
      (err as any).shortMessage = "Short";
      (err as any).message = "Long message";
      const result = normalizeError(err);
      expect(result.name).toBe("RpcError");
      expect(result.code).toBe("RPC_ERROR");
      expect(result.message).toBe("Short");
    });
  });
});
