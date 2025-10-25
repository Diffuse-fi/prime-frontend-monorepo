import { SdkError, SdkErrorCode } from "@diffuse/sdk-js";

export function isUserRejectedError(error: unknown): boolean {
  return (
    !!error && error instanceof SdkError && error.code === SdkErrorCode.USER_REJECTED
  );
}
