import type { HealthFactorThresholds, LtvThresholds } from "./types";

export const HEALTH_FACTOR: Required<HealthFactorThresholds> = {
  warnAt: 1.2,
  dangerAt: 1.05,
};

export const LTV: Required<LtvThresholds> = {
  warnAt: 0.75,
  dangerAt: 0.85,
};
