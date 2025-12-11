export interface DateFormatOpts {
  locale?: string;
  tz?: string;
}

export interface FormatResult<T = unknown> {
  /** Extra data. */
  meta?: Record<string, unknown>;
  /** Optional severity for UI styling. */
  severity?: Severity;
  /** Final stringified value for UI rendering. */
  text: string;
  /** Long description. */
  tooltip?: string;
  /** Optional unit/suffix for UIs that separate value & unit. */
  unit?: string;
  /** The original value. */
  value: T;
}

export interface HealthFactorThresholds {
  dangerAt?: number;
  warnAt?: number;
}

export interface LtvThresholds {
  dangerAt?: number;
  warnAt?: number;
}

export type Severity = "danger" | "muted" | "ok" | "warn";
