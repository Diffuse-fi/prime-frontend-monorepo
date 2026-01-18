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
