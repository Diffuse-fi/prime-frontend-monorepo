import { env } from "@/env";
import { matcher } from "matcher";
import { LogLevel, Namespace } from "./schemas";

type LogMethod = "error" | "warn" | "info";

const LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

function normalizePatterns(patterns: string): string[] {
  return patterns
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(p => (p.startsWith("-") ? "!" + p.slice(1) : p));
}

function nsMatchFactory(patterns: string) {
  const pats = normalizePatterns(patterns);
  const hasPositive = pats.some(p => !p.startsWith("!"));

  if (!hasPositive) return () => false;

  return (ns: Namespace) => matcher([ns], pats).length > 0;
}

const currentLogLevel = env.NEXT_PUBLIC_LOG_LEVEL ?? "trace";
const nsMatches = nsMatchFactory(env.NEXT_PUBLIC_LOG_NAMESPACES ?? "*");

function shouldLog(ns: Namespace, level: LogLevel) {
  if (!env.NEXT_PUBLIC_DEBUG) return false;

  const min = LEVELS[currentLogLevel];
  const lvl = LEVELS[level];

  if (lvl > min) return false;

  if (!nsMatches(ns)) return false;

  return true;
}

export type LogFn = (...args: unknown[]) => void;

export type Logger = {
  ns: string;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
};

function out(method: LogMethod, ns: Namespace, level: LogLevel, args: unknown[]) {
  const prefix = `%c[${ns.toUpperCase()}]%c (${level.toUpperCase()})`; // %c allows adding styles
  const styleLogLevel = "color:gray;";
  const styleNs = "font-weight:bold;";

  const logFunction = console[method] || console.log;

  logFunction.apply(console, [
    prefix,
    styleNs,
    styleLogLevel,
    ...args,
  ]);
}

export function createLogger(ns: Namespace): Logger {
  const make =
    (level: LogLevel, method: LogMethod) =>
    (...args: unknown[]) => {
      if (shouldLog(ns, level)) {
        out(method, ns, level, args);
      }
    };

  return {
    ns,
    error: make("error", "error"),
    warn: make("warn", "warn"),
    info: make("info", "info"),
    debug: make("debug", "info"),
    trace: make("trace", "info"),
  };
}
