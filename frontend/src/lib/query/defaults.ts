export function defaultRetry(failureCount: number) {
  return failureCount < 3;
}
