import type { MetadataRoute } from "next";
import localizatiionSettings from "../localization.json" with { type: "json" };
import path from "node:path";
import { readdirSync } from "node:fs";
import { env } from "@/env";
import { normalizeTrailingSlashes } from "@/lib/misc/metadata";

const origin = env.ORIGIN;

const SUPPORTED_LOCALES = localizatiionSettings.supported;
const DEFAULT_LOCALE = localizatiionSettings.default;
const needAlternates = SUPPORTED_LOCALES.length > 1;
const PAGE_FILES = new Set([
  "page.tsx",
  "page.ts",
]);
const ROUTING_ROOT_DIR = path.resolve(process.cwd(), "src/app/[lang]");

function isRouteGroup(name: string) {
  return name.startsWith("(") && name.endsWith(")");
}

function isDynamicSegment(name: string) {
  return name.startsWith("[") && name.endsWith("]");
}

function getPaths(rootDir: string = ROUTING_ROOT_DIR): string[] {
  const found: string[] = [];

  function walkSync(dir: string, segments: string[]) {
    const entries = readdirSync(dir, { withFileTypes: true });

    const hasPage = entries.some(e => e.isFile() && PAGE_FILES.has(e.name));

    if (hasPage) {
      const url = "/" + segments.join("/");
      found.push(url === "/" ? "/" : url.replace(/\/+/g, "/"));
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const name = entry.name;
      if (isDynamicSegment(name)) continue;

      const childDir = path.join(dir, name);

      if (isRouteGroup(name)) {
        walkSync(childDir, segments);
      } else {
        walkSync(childDir, [...segments, name]);
      }
    }
  }

  walkSync(rootDir, []);

  return Array.from(new Set(found)).sort();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getPaths();

  if (paths.length === 0) {
    return [];
  }

  if (!needAlternates) {
    return paths.map(url => ({
      url: `${origin}${normalizeTrailingSlashes(url)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: url === "/lend" ? 1 : 0.7,
    }));
  }

  return paths.map(url => ({
    url: `${origin}${normalizeTrailingSlashes(url)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: url === "/lend" ? 1 : 0.7,

    alternates: {
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LOCALES.map(lang => {
            const finalUrl =
              lang === DEFAULT_LOCALE
                ? `${origin}${normalizeTrailingSlashes(url)}`
                : `${origin}/${lang}${normalizeTrailingSlashes(url)}`;
            return [lang, finalUrl];
          })
        ),
        "x-default": `${origin}${normalizeTrailingSlashes(url)}`,
      },
    },
  }));
}
