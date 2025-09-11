import type { NextRequest, ImageResponseOptions } from "next/server";
import { ImageResponse } from "next/og";
import { CacheLifetimeSchema, OgSizeSchema, QuerySchema } from "./validations";

export const runtime = "edge";

const fontRegularURL = new URL(
  "../../fonts/dm-sans/DMSans-Regular.woff2",
  import.meta.url
);
const fontSemiBoldURL = new URL(
  "../../fonts/dm-sans/DMSans-SemiBold.woff2",
  import.meta.url
);

const memoLoadRetryOnUndefined = (url: URL) => {
  let p: Promise<ArrayBuffer | undefined> | undefined;

  return async () => {
    if (!p) {
      p = fetch(url)
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
        .catch(() => undefined);
    }
    const result = await p;
    if (result === undefined) p = undefined;
    return result;
  };
};

const loadFontRegular = memoLoadRetryOnUndefined(fontRegularURL);
const loadFontSemiBold = memoLoadRetryOnUndefined(fontSemiBoldURL);

const standardOgSize = OgSizeSchema.parse({ width: 1200, height: 630 });
const cacheLifeTime = CacheLifetimeSchema.parse(60 * 60 * 24 * 7);
const BRAND = process.env.NEXT_PUBLIC_APP_NAME;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const preset = QuerySchema.parse({
      title: searchParams.get("title") ?? undefined,
      description: searchParams.get("description") ?? undefined,
      path: searchParams.get("path") ?? undefined,
    });

    const [regular, semibold] = await Promise.all([
      loadFontRegular(),
      loadFontSemiBold(),
    ]);

    const fonts = [
      regular && {
        name: "DM Sans",
        data: regular,
        weight: 400,
        style: "normal" as const,
      },
      semibold && {
        name: "DM Sans",
        data: semibold,
        weight: 600,
        style: "normal" as const,
      },
    ].filter(Boolean) as ImageResponseOptions["fonts"];

    return new ImageResponse(
      (
        <div
          style={{
            width: standardOgSize.width,
            height: standardOgSize.height,
            display: "flex",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 28,
              opacity: 0.9,
              fontWeight: 600,
            }}
          >
            {BRAND}
            {preset.title}
            {/* "https://og-playground.vercel.app/" */}
          </div>
        </div>
      ),
      {
        ...standardOgSize,
        fonts: fonts,
        headers: {
          "Cache-Control": `public, max-age=${cacheLifeTime}, stale-while-revalidate=${cacheLifeTime}`,
        },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
