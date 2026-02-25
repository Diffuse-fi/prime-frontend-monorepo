import z from "zod";

export function envJsonSchemaWithError<T extends z.ZodTypeAny>(
  schema: T,
  isOptional = true
) {
  return z.preprocess(v => {
    if (typeof v !== "string") return v;

    const s = v.trim();
    if (s === "") {
      if (!isOptional) {
        throw new Error("Empty string received for required env variable.");
      }

      return;
    }

    try {
      return JSON.parse(s);
    } catch (error) {
      throw new Error("Invalid JSON", { cause: error });
    }
  }, schema);
}
