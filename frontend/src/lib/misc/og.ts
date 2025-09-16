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
