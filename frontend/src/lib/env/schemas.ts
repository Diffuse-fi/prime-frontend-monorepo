import { z } from "zod";

const emptyToUndef = <T extends z.ZodTypeAny>(inner: T) =>
  z.preprocess(v => (v === "" ? undefined : v), inner);

const zBool = z.preprocess(v => {
  if (typeof v === "boolean") return v;

  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1") return true;
    if (s === "false" || s === "0" || s === "") return false;
  }
  return v;
}, z.boolean());

const GTM_OR_GA_ID = /^(GTM-[A-Z0-9]+|G-[A-Z0-9]+)$/i;

export const envServerSchema = z.object({
  ORIGIN: emptyToUndef(z.string().url().min(1)).optional(),

  SENTRY_AUTH_TOKEN: emptyToUndef(z.string().min(1)).optional(),
  SENTRY_ORGANIZATION: emptyToUndef(z.string().min(1)).optional(),
  SENTRY_PROJECT: emptyToUndef(z.string().min(1)).optional(),

  ENABLE_HSTS: zBool.optional(),
});

export const envClientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),

  NEXT_PUBLIC_ENABLE_TESTNETS: zBool,
  NEXT_PUBLIC_ENABLE_MAINNETS: zBool,

  NEXT_PUBLIC_GTM_ID: emptyToUndef(z.string().regex(GTM_OR_GA_ID)).optional(),
  NEXT_PUBLIC_ENABLE_GTAG: zBool,

  NEXT_PUBLIC_SENTRY_DSN: emptyToUndef(z.string().url()).optional(),
  NEXT_PUBLIC_ENABLE_SENTRY: zBool,
});
