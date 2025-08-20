import { ensureLocaleCookie, localizationRewrite } from "./middlewares/localization";
import { applyCsp } from "./middlewares/applyCsp";
import { compose } from "./middlewares/utils";

export default compose({
  stack: [localizationRewrite],
  always: [applyCsp, ensureLocaleCookie],
});

export const config = {
  matcher: [
    {
      // Skip all internal paths
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
