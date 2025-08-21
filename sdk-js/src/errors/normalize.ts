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
import { ErrorCtx } from "./types";

function reasonOf(err: unknown): string | undefined {
  if (err instanceof ContractFunctionRevertedError) return err.shortMessage || err.reason;

  if (err instanceof ContractFunctionExecutionError)
    return err.cause?.shortMessage || err.shortMessage;

  if (err instanceof EstimateGasExecutionError) return err.shortMessage;

  if (err instanceof CallExecutionError) return err.shortMessage;

  return undefined;
}

export function normalizeViemError(err: unknown, context?: ErrorCtx): SdkError {
  if (err instanceof SdkError) return err;

  if (err instanceof UserRejectedRequestError) return new UserRejectedError(context, err);

  if (err instanceof AddressNotFoundError || err instanceof InvalidAddressError)
    return err;

  if (err instanceof ViemInsufficientFunds)
    return new InsufficientFundsError(context, err);

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

  if (err instanceof RpcRequestError)
    return new RpcError(err.shortMessage ?? "RPC error", context, err);
  if (err instanceof HttpRequestError)
    return new NetworkError(err.shortMessage ?? "HTTP error", context, err);

  if (err instanceof BaseError)
    return new RpcError(err.shortMessage ?? err.message, context, err);

  const fallBack = () => {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new UnknownError(context, err instanceof Error ? err : new Error(msg));
  };

  return fallBack();
}
