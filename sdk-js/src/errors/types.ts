export type SdkErrorJSON = {
  name: string;
  message: string;
  code: string;
  userMessage?: string;
  context?: Record<string, unknown>;
  stack?: string;
  cause?: { name?: string; message?: string; stack?: string } | undefined;
  version?: string;
};

export type ErrorCtx = Record<string, unknown> | undefined;
