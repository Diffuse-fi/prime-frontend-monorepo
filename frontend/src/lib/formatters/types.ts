export type Severity = "ok" | "warn" | "danger" | "muted";

export interface FormatResult<T = unknown> {
  /** The original value. */
  value: T;
  /** Final stringified value for UI rendering. */
  text: string;
  /** Optional unit/suffix for UIs that separate value & unit. */
  unit?: string;
  /** Long description. */
  tooltip?: string;
  /** Optional severity for UI styling. */
  severity?: Severity;
  /** Extra data. */
  meta?: Record<string, unknown>;
}

export interface DateFormatOpts {
  tz?: string;
  locale?: string;
}

export interface HealthFactorThresholds {
  warnAt?: number;
  dangerAt?: number;
}

export interface LtvThresholds {
  warnAt?: number;
  dangerAt?: number;
}
