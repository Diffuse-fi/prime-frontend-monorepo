import { Header } from "next/dist/lib/load-custom-routes";

export async function getHeaders(isProd: boolean): Promise<Header[]> {
  return [
    {
      source: "/(.*)",
      headers: [
        ...(isProd
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
        //
        { key: "Referrer-Policy", value: "no-referrer" },
        // Defines which features can be used in the browser.
        // Allows usb and hid for hardware wallets connect (but for the site itself only).
        {
          key: "Permissions-Policy",
          value:
            "camera=(), microphone=(), geolocation=(), usb=(self), hid=(self), accelerometer=(), gyroscope=(), magnetometer=(), payment=(), browsing-topics=()",
        },
      ],
    },
  ];
}
