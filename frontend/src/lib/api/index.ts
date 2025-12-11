import qs from "qs";

const apiRoutes = {
  og: "/api/og",
} as const satisfies Record<string, `/${string}`>;

export type ApiRouteKey = keyof typeof apiRoutes;

export function apiUrl<K extends ApiRouteKey>(
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
