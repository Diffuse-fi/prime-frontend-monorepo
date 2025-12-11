import { Severity } from "./types";

export const severityToTwClass: Record<Severity, string> = {
  danger: "text-red-500",
  muted: "text-gray-400",
  ok: "text-green-500",
  warn: "text-yellow-500",
};
