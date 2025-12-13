export type ErrorCtx = Record<string, unknown> | undefined;

export type SdkErrorJSON = {
  cause?: undefined | { message?: string; name?: string; stack?: string };
  code: string;
  context?: Record<string, unknown>;
  message: string;
  name: string;
  stack?: string;
  userMessage?: string;
  version?: string;
};
