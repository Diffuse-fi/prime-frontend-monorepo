import type { HealthFactorThresholds, LtvThresholds } from "./types";

export const HEALTH_FACTOR: Required<HealthFactorThresholds> = {
  dangerAt: 1.05,
  warnAt: 1.2,
};

export const LTV: Required<LtvThresholds> = {
  dangerAt: 0.85,
  warnAt: 0.75,
};

export const SCALES = {
  BPS: 10_000n,
  PERCENT: 100n,
} as const;

export const FORMAT_DEFAULTS = {
  fractionDigits: 2,
} as const;
