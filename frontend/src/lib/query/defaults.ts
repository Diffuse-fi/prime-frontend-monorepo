import { SdkError, SdkErrorCode } from "@diffuse/sdk-js";

export function defaultRetry(_: number, e: unknown) {
  if (!(e instanceof SdkError)) return true;

  return ![
    SdkErrorCode.USER_REJECTED,
    SdkErrorCode.WALLET_REQUIRED,
    SdkErrorCode.ADDRESS_NOT_FOUND,
    SdkErrorCode.INVALID_ADDRESS,
    SdkErrorCode.SIMULATION_REVERTED,
  ].includes(e.code);
}

export function defaultOnError(_: unknown) {
  // Fill in with error handling logic
  // Maybe some popup or logging
}
