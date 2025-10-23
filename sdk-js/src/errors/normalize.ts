import {
  BaseError,
  UserRejectedRequestError,
  InsufficientFundsError as ViemInsufficientFunds,
  ContractFunctionRevertedError,
  ContractFunctionExecutionError,
  EstimateGasExecutionError,
  CallExecutionError,
  RpcRequestError,
  HttpRequestError,
} from "viem";
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
} from "./errors";
import type { ErrorCtx } from "./types";

function firstCause<T>(err: unknown, guard: (e: unknown) => e is T): T | undefined {
  let cur: unknown = err;
  const seen = new Set<unknown>();

  while (cur && typeof cur === "object" && !seen.has(cur)) {
    seen.add(cur);
    if (guard(cur)) return cur;
    cur = (cur as any).cause;
  }

  return undefined;
}

function msgOf(e: any): string {
  return String(e?.shortMessage ?? e?.message ?? e?.details ?? "");
}

function reasonOf(err: unknown): string | undefined {
  if (err instanceof ContractFunctionRevertedError) return err.shortMessage || err.reason;
  if (err instanceof ContractFunctionExecutionError)
    return err.cause?.shortMessage || err.shortMessage;
  if (err instanceof EstimateGasExecutionError) return err.shortMessage;
  if (err instanceof CallExecutionError) return err.shortMessage;

  return undefined;
}

function isUserRejected(err: unknown): boolean {
  if (
    firstCause(
      err,
      (e): e is UserRejectedRequestError => e instanceof UserRejectedRequestError
    )
  ) {
    return true;
  }
  const rpc4001 = firstCause(
    err,
    (e): e is RpcRequestError => e instanceof RpcRequestError && e.code === 4001
  );
  if (rpc4001) return true;

  let cur: unknown = err;
  const seen = new Set<unknown>();
  const rx = /user (rejected|denied)|request rejected/i;

  while (cur && typeof cur === "object" && !seen.has(cur)) {
    seen.add(cur);
    if (rx.test(msgOf(cur))) return true;
    cur = (cur as any).cause;
  }

  return false;
}

export function normalizeError(err: unknown, context?: ErrorCtx): SdkError {
  if (err instanceof SdkError) return err;

  if (isUserRejected(err)) return new UserRejectedError(context, err as Error);

  if (err instanceof AddressNotFoundError || err instanceof InvalidAddressError)
    return err;

  if (
    firstCause(err, (e): e is ViemInsufficientFunds => e instanceof ViemInsufficientFunds)
  ) {
    return new InsufficientFundsError(context, err as Error);
  }

  if (err instanceof ContractFunctionRevertedError) {
    return new SimulationRevertedError(reasonOf(err), context, err);
  }

  if (
    err instanceof ContractFunctionExecutionError ||
    err instanceof EstimateGasExecutionError ||
    err instanceof CallExecutionError
  ) {
    return new ContractRevertError(reasonOf(err), context, err);
  }

  const rpcErr = firstCause(
    err,
    (e): e is RpcRequestError => e instanceof RpcRequestError
  );
  if (rpcErr) return new RpcError(rpcErr.shortMessage ?? "RPC error", context, rpcErr);

  const httpErr = firstCause(
    err,
    (e): e is HttpRequestError => e instanceof HttpRequestError
  );
  if (httpErr)
    return new NetworkError(httpErr.shortMessage ?? "HTTP error", context, httpErr);

  if (err instanceof BaseError) {
    return new RpcError(err.shortMessage ?? (err as any).message, context, err);
  }

  const msg = err instanceof Error ? err.message : "Unknown error";
  return new UnknownError(context, err instanceof Error ? err : new Error(msg));
}
