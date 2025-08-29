import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES as locales,
  type Locale,
} from "@/lib/localization/locale";
import type { Finalizer, MW } from "./utils";

const LOCALE_COOKIE = "NEXT_LOCALE";

const cookieOpts = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

function negotiateLocale(request: NextRequest): Locale {
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => (headers[k] = v));
  const languages = new Negotiator({ headers }).languages();

  return matchLocale(languages, locales, DEFAULT_LOCALE) as Locale;
}

function splitFirst(pathname: string) {
  const [, first = "", ...rest] = pathname.split("/");
  const restPath = rest.length ? `/${rest.join("/")}` : "/";
  return { seg: first, restPath };
}

export const localizationRewrite: MW = (request, _ev, ctx) => {
  const { pathname } = request.nextUrl;
  const { seg, restPath } = splitFirst(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;

  if (locales.includes(seg)) {
    if (seg === DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = restPath;
      ctx.locale = DEFAULT_LOCALE;
      return NextResponse.redirect(url);
    }

    ctx.locale = seg as Locale;
    return NextResponse.next();
  }

  const target =
    cookieLocale && locales.includes(cookieLocale)
      ? cookieLocale
      : negotiateLocale(request);

  if (target === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    ctx.locale = DEFAULT_LOCALE;

    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname}`;
  ctx.locale = target as Locale;
  return NextResponse.redirect(url);
};

export const ensureLocaleCookie: Finalizer = (req, _ev, ctx, res) => {
  const chosen = (ctx.locale as string) || req.cookies.get(LOCALE_COOKIE)?.value;
  if (chosen) res.cookies.set(LOCALE_COOKIE, chosen, cookieOpts);
  return res;
};
