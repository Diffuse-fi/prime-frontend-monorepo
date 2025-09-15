import type { NextRequest, ImageResponseOptions } from "next/server";
import { ImageResponse } from "next/og";
import { QuerySchema } from "./validations";
import { env } from "@/env";

export const runtime = "edge";

const fontRegularURL = new URL("../../fonts/dm-sans/DMSans-Regular.ttf", import.meta.url);
const fontSemiBoldURL = new URL(
  "../../fonts/dm-sans/DMSans-SemiBold.ttf",
  import.meta.url
);

const dev = process.env.NODE_ENV !== "production";

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

const standardOgSize = { width: 1200, height: 630 };
const BRAND = env.NEXT_PUBLIC_APP_NAME;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const preset = QuerySchema.parse(Object.fromEntries(searchParams));

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
              display: "flex",
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
        ...(fonts?.length ? { fonts } : {}),
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": dev
            ? "no-store"
            : "public, max-age=31536000, s-maxage=31536000, immutable",
          "Cross-Origin-Resource-Policy": "cross-origin",
          "X-OG-Version": preset.version,
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
