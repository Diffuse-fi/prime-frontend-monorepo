"use client";

import { useReportWebVitals } from "next/web-vitals";

function toInt(name: string, value: number) {
  return name === "CLS" ? Math.round(value * 1000) : Math.round(value);
}

export function WebVitals() {
  useReportWebVitals(metric => {
    const payload = {
      event: "web_vitals",
      metric_name: metric.name,
      metric_id: metric.id,
      value: toInt(metric.name, metric.value),
      label: metric.label,
      path: location.pathname,
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  });

  return null;
}
