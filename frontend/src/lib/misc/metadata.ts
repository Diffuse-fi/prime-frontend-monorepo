export function normalizeTrailingSlashes(url: string) {
  if (url === "/") {
    return url;
  }

  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function normalizeTwitterHandle(handle?: string) {
  if (!handle) {
    return;
  }

  return handle.startsWith("@") ? handle : `@${handle}`;
}

export function toOgLocale(input: string): string {
  try {
    const loc = new Intl.Locale(input).maximize();

    const lang = loc.language;
    const region = loc.region;

    return region ? `${lang}_${region}` : lang;
  } catch {
    return input;
  }
}
