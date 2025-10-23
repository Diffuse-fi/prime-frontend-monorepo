"use client";

import { useReportWebVitals } from "next/web-vitals";

function toInt(name: string, value: number) {
  return name === "CLS" ? Math.round(value * 1000) : Math.round(value);
}

export function WebVitals() {
  useReportWebVitals(metric => {
    const params = {
      value: toInt(metric.name, metric.value),
      metric_value: metric.value,
      metric_id: metric.id,
      label: metric.label,
      page_path: location.pathname,
      non_interaction: true,
      debug_mode: process.env.NODE_ENV !== "production",
    };

    window.gtag?.("event", metric.name, params);
  });

  return null;
}
