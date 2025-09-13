import { nonceHeader, randomNonce } from "@/lib/nonce";
import { type Finalizer } from "./utils";
import { chains } from "@/lib/chains";
import { env } from "@/env";

const isProd = process.env.NODE_ENV === "production";
const testnetsEnabled = !!env.NEXT_PUBLIC_ENABLE_TESTNETS;
const mainnetsEnabled = !!env.NEXT_PUBLIC_ENABLE_MAINNETS;
const httpsSecurityEnabled = !!env.ENABLE_HTTPS_SECURITY_HEADERS;

// Allowed sources to connect to, e.g. for fetch, WebSocket, etc.
const allowedSourcesRaw = [
  "'self'",
  "https://www.google-analytics.com",
];

if (mainnetsEnabled) {
  allowedSourcesRaw.push(...chains.mainnets.map(c => c.rpcUrls.default.http).flat());
}

if (testnetsEnabled) {
  allowedSourcesRaw.push(...chains.testnets.map(c => c.rpcUrls.default.http).flat());
}

const allowedSources = allowedSourcesRaw.filter(Boolean).join(" ");

const allowedTrirdPartyScripts = [
  "https://www.googletagmanager.com",
  // Add any other third-party scripts that are allowed in production
]
  .filter(Boolean)
  .join(" ");

const allowedFrameAncestors = [
  // Specify here if a website needs to be embedded in an iframe on a specific domain
]
  .filter(Boolean)
  .join(" ");

function mergeCsp(existing: string | null, extra: string) {
  return existing && existing.length ? `${existing}; ${extra}` : extra;
}

function normalizeTemplateString(str: string) {
  return str.replace(/\s+/g, " ").trim();
}

export const cspMiddleware: Finalizer = (_req, _ev, ctx, res) => {
  const nonce = (ctx.nonce as string) || randomNonce();
  ctx.nonce = nonce;
  res.headers.set(nonceHeader, nonce);

  const extra = isProd
    ? normalizeTemplateString(
        // TODO - add nonce to style-src when rainbow-kit allows nonce passing
        `
          default-src 'self';
          script-src 'nonce-${nonce}' 'strict-dynamic' ${allowedTrirdPartyScripts};
          style-src 'self' 'unsafe-inline';
          connect-src ${allowedSources};
          img-src 'self' blob: data:;
          font-src 'self';
          frame-src 'self';
          frame-ancestors ${allowedFrameAncestors || "'none'"};
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          ${httpsSecurityEnabled ? "upgrade-insecure-requests;" : ""}
        `
      )
    : "";

  res.headers.set(
    "Content-Security-Policy",
    mergeCsp(res.headers.get("Content-Security-Policy"), extra)
  );

  return res;
};
