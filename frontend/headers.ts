import { Header } from "next/dist/lib/load-custom-routes";

export async function getHeaders(isProd: boolean): Promise<Header[]> {
  return [
    {
      source: "/(.*)",
      headers: [
        ...(isProd
          ? [
              // Enforce HTTPS for every request to prevent MITM SSL stripping attacks.
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
