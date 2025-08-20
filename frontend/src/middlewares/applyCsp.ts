import { nonceHeader, randomNonce } from "@/lib/nonce";
import { type Finalizer } from "./utils";
import { berachain } from "@/lib/wagmi/chains/berachain";
import { ethMainnet } from "@/lib/wagmi/chains/mainnet";

const isProd = process.env.NODE_ENV === "production";
const testnetsEnabled = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true";

const allowedSources = [
  "'self'",
  ...(testnetsEnabled
    ? [berachain.rpcUrls.default.http, berachain.rpcUrls.public.http]
    : []),
  ethMainnet.rpcUrls.default.http,
]
  .filter(Boolean)
  .join(" ");

const allowedTrirdPartyScripts = [
  "https://www.googletagmanager.com",
  // Add any other third-party scripts that are allowed in production
]
  .filter(Boolean)
  .join(" ");

function mergeCsp(existing: string | null, extra: string) {
  return existing && existing.length ? `${existing}; ${extra}` : extra;
}

function normalizeTemplateString(str: string) {
  return str.replace(/\s+/g, " ").trim();
}

export const applyCsp: Finalizer = (_req, _ev, ctx, res) => {
  const nonce = (ctx.nonce as string) || randomNonce();
  ctx.nonce = nonce;
  res.headers.set(nonceHeader, nonce);

  const extra = isProd
    ? normalizeTemplateString(
        `
          default-src 'self';
          script-src 'nonce-${nonce}' 'strict-dynamic' ${allowedTrirdPartyScripts};
          style-src 'self' 'nonce-${nonce}';
          connect-src ${allowedSources};
          img-src 'self' blob: data:;
          font-src 'self';
          frame-src 'self';
          frame-ancestors 'none';
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          upgrade-insecure-requests;
        `
      )
    : "";

  res.headers.set(
    "Content-Security-Policy",
    mergeCsp(res.headers.get("Content-Security-Policy"), extra)
  );

  return res;
};
