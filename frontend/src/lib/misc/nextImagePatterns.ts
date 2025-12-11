import { getAssetsResourcesUrls, getChainsResourcesUrls } from "@diffuse/config";

export function getRemotePatternsFromAssetsAndChains() {
  const urls = [
    ...getAssetsResourcesUrls(),
    ...getChainsResourcesUrls(),
  ];
  const map = new Map<string, { hostname: string; protocol: "http" | "https" }>();

  for (const urlString of urls) {
    try {
      const url = new URL(urlString);

      const protocol = url.protocol.replace(":", "") as "http" | "https";
      const hostname = url.hostname;
      const key = `${protocol}://${hostname}`;

      if (!map.has(key)) {
        map.set(key, { hostname, protocol });
      }
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[images] Skipping invalid asset URL:", urlString);
      }
    }
  }

  return [...map.values()];
}
