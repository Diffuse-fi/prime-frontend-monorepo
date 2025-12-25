import { matcher } from "matcher";

import { env } from "@/env";

import { LogLevel, Namespace } from "./schemas";

type LogMethod = "error" | "info" | "warn";

const LEVELS: Record<LogLevel, number> = {
  debug: 3,
  error: 0,
  info: 2,
  trace: 4,
  warn: 1,
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

export type LogFn = (...args: unknown[]) => void;

export type Logger = {
  debug: LogFn;
  error: LogFn;
  info: LogFn;
  ns: string;
  trace: LogFn;
  warn: LogFn;
};

export function createLogger(ns: Namespace): Logger {
  const make =
    (level: LogLevel, method: LogMethod) =>
    (...args: unknown[]) => {
      if (shouldLog(ns, level)) {
        out(method, ns, level, args);
      }
    };

  return {
    debug: make("debug", "info"),
    error: make("error", "error"),
    info: make("info", "info"),
    ns,
    trace: make("trace", "info"),
    warn: make("warn", "warn"),
  };
}

function out(method: LogMethod, ns: Namespace, level: LogLevel, args: unknown[]) {
  const prefix = `%c[${ns.toUpperCase()}]%c (${level.toUpperCase()})`; // %c allows adding styles
  const styleLogLevel = "color:gray;";
  const styleNs = "font-weight:bold;";

  // eslint-disable-next-line no-console
  const logFunction = console[method] || console.log;

  logFunction.apply(console, [
    prefix,
    styleNs,
    styleLogLevel,
    ...args,
  ]);
}

function shouldLog(ns: Namespace, level: LogLevel) {
  if (!env.NEXT_PUBLIC_DEBUG) return false;

  const min = LEVELS[currentLogLevel];
  const lvl = LEVELS[level];

  if (lvl > min) return false;

  if (!nsMatches(ns)) return false;

  return true;
}
