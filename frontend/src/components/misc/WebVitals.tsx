"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals(metric => {
    const params = {
      debug_mode: process.env.NODE_ENV !== "production",
      label: metric.label,
      metric_id: metric.id,
      metric_value: metric.value,
      non_interaction: true,
      page_path: location.pathname,
      value: toInt(metric.name, metric.value),
    };

    globalThis.gtag?.("event", metric.name, params);
  });

  return null;
}

function toInt(name: string, value: number) {
  return name === "CLS" ? Math.round(value * 1000) : Math.round(value);
}
