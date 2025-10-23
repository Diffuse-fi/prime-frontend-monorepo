import { type Finalizer } from "./utils";
import { env } from "@/env";
import { RPCs } from "@/lib/chains/config";

const isProd = process.env.NODE_ENV === "production";
const httpsSecurityEnabled = !!env.ENABLE_HTTPS_SECURITY_HEADERS;

// Allowed sources to connect to, e.g. for fetch, WebSocket, etc.
const allowedSources = [
  "'self'",
  "https://www.google-analytics.com",
  // Web3Modal API (used by WalletConnect V2)
  "https://api.web3modal.org",
  // WalletConnect V2
  "wss://relay.walletconnect.org",
  "https://relay.walletconnect.org",
  "https://pulse.walletconnect.org",
  // EUC domain for ENS avatar images
  "https://euc.li",
  // Allowed chains RPC URLs
  ...Object.values(RPCs).flat(),
]
  .filter(Boolean)
  .join(" ");

const allowedScriptSources = [
  "https://www.googletagmanager.com",
]
  .filter(Boolean)
  .join(" ");

const allowedFrameAncestors = [
  // Specify here if a website needs to be embedded in an iframe on a specific domain
  "https://app.safe.global", // Gnosis Safe
]
  .filter(Boolean)
  .join(" ");

const allowedFrameSources = [
  // Domains allowed to be inside iframes on our site
  "https://verify.walletconnect.org", // WalletConnect session verification iframe
]
  .filter(Boolean)
  .join(" ");

const allowedImageSources = [
  "https://euc.li", // EUC domain for ENS avatar images
]
  .filter(Boolean)
  .join(" ");

function mergeCsp(existing: string | null, extra: string) {
  return existing && existing.length ? `${existing}; ${extra}` : extra;
}

function normalizeTemplateString(str: string) {
  return str.replace(/\s+/g, " ").trim();
}

export const cspMiddleware: Finalizer = (_req, _ev, _ctx, res) => {
  const extra = isProd
    ? normalizeTemplateString(
        `
          default-src 'self';
          script-src 'self' 'unsafe-inline' ${allowedScriptSources};
          style-src 'self' 'unsafe-inline';
          connect-src ${allowedSources};
          img-src 'self' blob: data: ${allowedImageSources};
          font-src 'self';
          frame-src 'self' ${allowedFrameSources};
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
