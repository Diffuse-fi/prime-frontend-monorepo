export function parseJsonBigint(str: string) {
  return JSON.parse(str, (_, val) =>
    typeof val === "string" && val.endsWith("n") ? BigInt(val.slice(0, -1)) : val
  );
}

export function stringifyJsonBigint(obj: unknown) {
  return JSON.stringify(obj, (_, val) =>
    typeof val === "bigint" ? `${val.toString()}n` : val
  );
}
