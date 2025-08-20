import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import {
  Locale,
  SUPPORTED_LOCALES as locales,
  DEFAULT_LOCALE,
} from "@/lib/localization/locale";
import { Finalizer, MW } from "./utils";

const LOCALE_COOKIE = "NEXT_LOCALE";

const cookieOpts = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};

function asPlainHeaders(request: NextRequest) {
  const h: Record<string, string> = {};
  request.headers.forEach((v, k) => (h[k] = v));
  return h;
}

function negotiateLocale(request: NextRequest) {
  const headers = asPlainHeaders(request);

  const languages = new Negotiator({ headers }).languages();
  return matchLocale(languages, locales, DEFAULT_LOCALE);
}

function getPathLocale(pathname: string) {
  const locale = pathname.split("/")[1];
  const restPath = pathname.replace(`/${locale}`, "") || "/";
  const isSupported = locales.find(l => l === locale);

  return { isSupported, locale, restPath };
}

export const localizationRewrite: MW = (request, _ev, ctx) => {
  const { pathname } = request.nextUrl;
  const { locale: pathLocale, isSupported, restPath } = getPathLocale(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;

  if (pathLocale) {
    if (!isSupported) {
      const url = request.nextUrl.clone();
      url.pathname = `/${DEFAULT_LOCALE}${restPath}`;
      ctx.locale = DEFAULT_LOCALE;

      return NextResponse.redirect(url);
    }

    if (pathLocale === DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = restPath;
      ctx.locale = DEFAULT_LOCALE;

      return NextResponse.redirect(url);
    }

    ctx.locale = pathLocale;
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

  const isTargetSupported = locales.includes(target);
  const finalLocale = isTargetSupported ? target : DEFAULT_LOCALE;
  const url = request.nextUrl.clone();
  url.pathname = `/${finalLocale}${pathname}`;
  ctx.locale = finalLocale;

  return NextResponse.redirect(url);
};

export const ensureLocaleCookie: Finalizer = (req, _ev, ctx, res) => {
  const chosen = (ctx.locale as string) || req.cookies.get(LOCALE_COOKIE)?.value;
  if (chosen) res.cookies.set(LOCALE_COOKIE, chosen, cookieOpts);

  return res;
};
