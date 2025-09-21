import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const zBool = z.preprocess(v => {
  if (typeof v === "boolean") return v;

  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1") return true;
    if (s === "false" || s === "0" || s === "") return false;
  }
  return v;
}, z.boolean());

const zInt = z.preprocess(v => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return v;
}, z.number().int());

const GTM_OR_GA_ID = /^(GTM-[A-Z0-9]+|G-[A-Z0-9]+)$/i;

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    ORIGIN: z.url(),

    SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
    SENTRY_ORGANIZATION: z.string().min(1).optional(),
    SENTRY_PROJECT: z.string().min(1).optional(),

    ENABLE_HTTPS_SECURITY_HEADERS: zBool.optional(),

    ORG_TWITTER_ACCOUNT: z.string().min(1).optional(),
    ORG_GITHUB_ACCOUNT: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),

    NEXT_PUBLIC_ENABLE_TESTNETS: zBool.optional(),
    NEXT_PUBLIC_ENABLE_MAINNETS: zBool.optional(),
    NEXT_PUBLIC_INITIAL_CHAIN_ID: zInt,

    NEXT_PUBLIC_GTM_ID: z.string().regex(GTM_OR_GA_ID).optional(),
    NEXT_PUBLIC_ENABLE_GTAG: zBool.optional(),

    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
    NEXT_PUBLIC_ENABLE_SENTRY: zBool.optional(),

    NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1),
    NEXT_PUBLIC_OG_VERSION: z.string().min(1).optional(),

    NEXT_PUBLIC_RPC_MAINNET: z.url().optional(),
    NEXT_PUBLIC_RPC_ARBITRUM: z.url().optional(),
    NEXT_PUBLIC_RPC_BERA: z.url().optional(),
  },
  // Due to how Next.js loads environment variables, we must reflect here client variables
  // to be available at build time.
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS,
    NEXT_PUBLIC_ENABLE_MAINNETS: process.env.NEXT_PUBLIC_ENABLE_MAINNETS,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_ENABLE_GTAG: process.env.NEXT_PUBLIC_ENABLE_GTAG,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    NEXT_PUBLIC_OG_VERSION: process.env.NEXT_PUBLIC_OG_VERSION,
    NEXT_PUBLIC_RPC_MAINNET: process.env.NEXT_PUBLIC_RPC_MAINNET,
    NEXT_PUBLIC_RPC_ARBITRUM: process.env.NEXT_PUBLIC_RPC_ARBITRUM,
    NEXT_PUBLIC_RPC_BERA: process.env.NEXT_PUBLIC_RPC_BERA,
    NEXT_PUBLIC_INITIAL_CHAIN_ID: process.env.NEXT_PUBLIC_INITIAL_CHAIN_ID,
  },
});
