import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import {
  Locale,
  SUPPORTED_LOCALES as locales,
  DEFAULT_LOCALE,
} from "@/lib/localization/locale";

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

function getNegotiatedLocale(request: NextRequest) {
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

export function localizationMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale: pathLocale, isSupported, restPath } = getPathLocale(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (pathLocale) {
    if (!isSupported) {
      const url = request.nextUrl.clone();
      url.pathname = `/${DEFAULT_LOCALE}${restPath}`;

      const res = NextResponse.redirect(url);

      res.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, cookieOpts);
      return res;
    }

    if (pathLocale === DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = restPath;

      const res = NextResponse.redirect(url);
      res.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, cookieOpts);

      return res;
    }

    if (cookieLocale !== pathLocale) {
      const res = NextResponse.next();
      res.cookies.set(LOCALE_COOKIE, pathLocale, cookieOpts);
      return res;
    }

    return NextResponse.next();
  }

  const targetLocale =
    (cookieLocale && locales.includes(cookieLocale as Locale) && cookieLocale) ||
    getNegotiatedLocale(request);

  if (targetLocale === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;

    const res = NextResponse.rewrite(url);
    if (cookieLocale !== targetLocale)
      res.cookies.set(LOCALE_COOKIE, targetLocale, cookieOpts);
    return res;
  }

  const url = request.nextUrl.clone();
  const isTargetLocaleSupported = locales.includes(targetLocale as Locale);

  if (!isTargetLocaleSupported) {
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  } else {
    url.pathname = `/${targetLocale}${pathname}`;
  }

  const res = NextResponse.redirect(url);
  res.cookies.set(LOCALE_COOKIE, targetLocale, cookieOpts);

  return res;
}
