import qs from "qs";

import { env } from "@/env";

const apiRoutes = {
  og: "/api/og",
  ptAmount: `${env.NEXT_PUBLIC_API_BASE_URL}/getPtAmount`,
} as const;

export type ApiRouteKey = keyof typeof apiRoutes;

export function getApiUrl<K extends ApiRouteKey>(
  key: K,
  params?: Record<
    string,
    (boolean | number | string)[] | boolean | number | string | undefined
  >
) {
  const search = params
    ? `?${qs.stringify(params, {
        arrayFormat: "comma",
        sort: (a, b) => a.localeCompare(b),
      })}`
    : "";

  return `${apiRoutes[key]}${search}`;
}
