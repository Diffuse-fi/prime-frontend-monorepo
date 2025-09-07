import { Header } from "next/dist/lib/load-custom-routes";

export async function getHeaders(enableHSTS = false): Promise<Header[]> {
  return [
    {
      source: "/(.*)",
      headers: [
        ...(enableHSTS
          ? [
              // Enforce HTTPS for every request to prevent MITM SSL stripping attacks.
              // TODO - tomake preload work, we need to add the domain to the HSTS preload list:
              // https://hstspreload.org/
              // TODO - increase max-age to 2 years (63072000 seconds) after testing.
              {
                key: "Strict-Transport-Security",
                value: "max-age=86400; includeSubDomains; preload",
              },
            ]
          : []),
        // Prevents the browser from interpreting files as a different MIME type than what is specified in the Content-Type header.
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Prevents clickjacking attacks by disallowing the page to be rendered in iframes (Legacy browsers).
        // If the site need to be embedded in a partner's iframe, this header should be removed.
        { key: "X-Frame-Options", value: "DENY" },
        // Prevents sending full url in the Referer header when navigating to a different origin.
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // Defines which features can be used in the browser.
        // Allows usb and hid for hardware wallets connect (but for the site itself only).
        {
          key: "Permissions-Policy",
          value:
            "camera=(), microphone=(), geolocation=(), usb=(self), hid=(self), accelerometer=(), gyroscope=(), magnetometer=(), payment=(), browsing-topics=()",
        },
        // Prohibits for the site global context to be shared with cross-origin popups via window.opener
        // and ensures that all links to cross-origin sites include rel="noopener" (Legacy browsers).
        {
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin",
        },
        // Restricts the list of origins that can load resources from this site.
        {
          key: "Cross-Origin-Resource-Policy",
          value: "same-origin",
        },
        // Requires embedded resources to opt-in to being loaded in cross-origin contexts.
        // This is a report-only policy to avoid potential breakage
        // Replace with "require-corp" once all resources support COEP.
        {
          key: "Cross-Origin-Embedder-Policy",
          value: "report-only;",
        },
      ],
    },
    // Allow cross-origin image requests for Open Graph images to share on social networks.
    {
      source: "/api/og/:path*",
      headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }],
    },
  ];
}
