import { Header } from "next/dist/lib/load-custom-routes";

const devCsp = [
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

const prodCsp = [
  "default-src 'self'",
  // Prefer nonce + strict-dynamic if you can wire a nonce; otherwise keep 'self' only.
  "script-src 'self' 'strict-dynamic' 'nonce-__CSP_NONCE__'",
  "style-src 'self' 'unsafe-inline'", // NextJS inlines critical CSS
  "img-src 'self' data:",
  // Add all RPCs, analytics, Sentry, WalletConnect, etc. that your app actually calls:
  "connect-src 'self' https://api.defuse-prime.com https://*.walletconnect.com wss://*.walletconnect.com https://*.alchemy.com",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export async function getHeaders(isProd: boolean): Promise<Header[]> {
  return [
    {
      source: "/(.*)",
      headers: [
        ...(isProd
          ? [
              {
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload",
              },
            ]
          : []),

        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        //
        { key: "Referrer-Policy", value: "no-referrer" },
        // Defines which features can be used in the browser.
        {
          key: "Permissions-Policy",
          value:
            "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), interest-cohort=()",
        },
        // Defines which resources can be loaded by the page.
        {
          key: "Content-Security-Policy",
          value: isProd ? prodCsp : devCsp,
        },
        {
          key: "Cross-Origin-Embedder-Policy",
          value: "require-corp",
        },
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin",
        },
        {
          key: "Cross-Origin-Resource-Policy",
          value: "same-site",
        },
      ],
    },
  ];
}
