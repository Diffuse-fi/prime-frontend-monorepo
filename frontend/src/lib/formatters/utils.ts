import { Severity } from "./types";

export const severityToTwClass: Record<Severity, string> = {
  ok: "text-green-500",
  warn: "text-yellow-500",
  danger: "text-red-500",
  muted: "text-gray-400",
};
