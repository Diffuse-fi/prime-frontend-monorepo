import type { ImageResponseOptions, NextRequest } from "next/server";

import * as Sentry from "@sentry/nextjs";
import { ImageResponse } from "next/og";

import { env } from "@/env";

import { QuerySchema } from "./validations";

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
        .catch(() => {});
    }

    const result = await p;
    if (result === undefined) p = undefined;

    return result;
  };
};

const loadFontRegular = memoLoadRetryOnUndefined(fontRegularURL);
const loadFontSemiBold = memoLoadRetryOnUndefined(fontSemiBoldURL);

const standardOgSize = { height: 630, width: 1200 };
const BRAND = env.NEXT_PUBLIC_APP_NAME;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const expectedParams = ["title", "version", "description", "path"];
    const filteredParams: Record<string, string> = {};
    for (const key of expectedParams) {
      const value = searchParams.get(key);
      if (value !== null) {
        filteredParams[key] = value;
      }
    }

    const preset = QuerySchema.parse(filteredParams);

    const [regular, semibold] = await Promise.all([
      loadFontRegular(),
      loadFontSemiBold(),
    ]);

    const fonts = [
      regular && {
        data: regular,
        name: "DM Sans",
        style: "normal" as const,
        weight: 400,
      },
      semibold && {
        data: semibold,
        name: "DM Sans",
        style: "normal" as const,
        weight: 600,
      },
    ].filter(Boolean) as ImageResponseOptions["fonts"];

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontFamily: "DM Sans, sans-serif",
            height: standardOgSize.height,
            width: standardOgSize.width,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              opacity: 0.9,
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
          "Cache-Control": dev
            ? "no-store"
            : "public, max-age=31536000, s-maxage=31536000, immutable",
          "Content-Type": "image/png",
          "Cross-Origin-Resource-Policy": "cross-origin",
          "X-OG-Version": preset.version,
        },
      }
    );
  } catch (error) {
    Sentry.captureException(error);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
