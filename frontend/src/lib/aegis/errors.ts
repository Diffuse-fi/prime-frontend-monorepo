export function isDataEmptyError(error: unknown) {
  const msg =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";

  return (
    msg.toLowerCase().includes("dataempty") || msg.toLowerCase().includes("data empty")
  );
}

export function toErr(error: unknown) {
  return error instanceof Error ? error : new Error("Unknown error");
}

export const isEmptyDataLike = (error: unknown) => {
  if (isDataEmptyError(error)) return true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = error as any;
  const msg =
    typeof e?.shortMessage === "string"
      ? e.shortMessage
      : typeof e?.message === "string"
        ? e.message
        : "";

  if (msg.includes("EmptyData") || msg.includes("DataEmpty")) return true;
  if (msg.includes("0xea5ffb2c")) return true;

  const sig = typeof e?.signature === "string" ? e.signature : "";
  if (sig === "0xea5ffb2c") return true;

  return false;
};

export const isInvalidDeadlineLike = (error: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = error as any;
  let msg = "";
  if (typeof e?.shortMessage === "string") {
    msg = e.shortMessage;
  } else if (typeof e?.message === "string") {
    msg = e.message;
  }

  return msg.toLowerCase().includes("invaliddeadline");
};
