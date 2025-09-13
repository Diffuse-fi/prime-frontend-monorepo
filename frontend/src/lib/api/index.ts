import qs from "qs";

const apiRoutes = {
  assetMetaList: "/api/tokens-meta-list",
  og: "/api/og",
} as const satisfies Record<string, `/${string}`>;

export type ApiRouteKey = keyof typeof apiRoutes;

export function apiUrl<K extends ApiRouteKey>(
  key: K,
  params?: Record<
    string,
    string | number | boolean | undefined | (string | number | boolean)[]
  >
) {
  const search = params
    ? `?${qs.stringify(params, {
        arrayFormat: "comma",
      })}`
    : "";

  return `${apiRoutes[key]}${search}`;
}
