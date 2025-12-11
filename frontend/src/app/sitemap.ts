import type { MetadataRoute } from "next";

import { readdirSync } from "node:fs";
import path from "node:path";

import { env } from "@/env";
import { normalizeTrailingSlashes } from "@/lib/misc/metadata";

import localizatiionSettings from "../localization.json" with { type: "json" };

const origin = env.ORIGIN;

const SUPPORTED_LOCALES = localizatiionSettings.supported;
const DEFAULT_LOCALE = localizatiionSettings.default;
const needAlternates = SUPPORTED_LOCALES.length > 1;
const PAGE_FILES = new Set([
  "page.ts",
  "page.tsx",
]);
const ROUTING_ROOT_DIR = path.resolve(process.cwd(), "src/app/[lang]");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = getPaths();

  if (paths.length === 0) {
    return [];
  }

  if (!needAlternates) {
    return paths.map(url => ({
      changeFrequency: "daily",
      lastModified: new Date().toISOString(),
      priority: url === "/lend" ? 1 : 0.7,
      url: `${origin}${normalizeTrailingSlashes(url)}`,
    }));
  }

  return paths.map(url => ({
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
    changeFrequency: "daily",
    lastModified: new Date().toISOString(),
    priority: url === "/lend" ? 1 : 0.7,

    url: `${origin}${normalizeTrailingSlashes(url)}`,
  }));
}

function getPaths(rootDir: string = ROUTING_ROOT_DIR): string[] {
  const found: string[] = [];

  function walkSync(dir: string, segments: string[]) {
    const entries = readdirSync(dir, { withFileTypes: true });

    const hasPage = entries.some(e => e.isFile() && PAGE_FILES.has(e.name));

    if (hasPage) {
      const url = "/" + segments.join("/");
      found.push(url === "/" ? "/" : url.replaceAll(/\/+/g, "/"));
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

  return [...new Set(found)].sort();
}

function isDynamicSegment(name: string) {
  return name.startsWith("[") && name.endsWith("]");
}

function isRouteGroup(name: string) {
  return name.startsWith("(") && name.endsWith(")");
}
