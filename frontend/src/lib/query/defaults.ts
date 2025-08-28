import { SdkError, SdkErrorCode } from "@diffuse/sdk-js";

export function defaultRetry(failureCount: number, e: unknown) {
  if (e instanceof SdkError) {
    return ![
      SdkErrorCode.USER_REJECTED,
      SdkErrorCode.WALLET_REQUIRED,
      SdkErrorCode.ADDRESS_NOT_FOUND,
      SdkErrorCode.INVALID_ADDRESS,
      SdkErrorCode.SIMULATION_REVERTED,
    ].includes(e.code);
  }
  return failureCount < 3;
}

export const defaultMutationRetry = defaultRetry;
