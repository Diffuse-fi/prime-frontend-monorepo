import { localizationMiddleware } from "./middlewares/localization";
import { cspMiddleware } from "./middlewares/csp";
import { compose } from "./middlewares/utils";

export default compose({
  stack: [localizationMiddleware],
  always: [cspMiddleware],
});

export const config = {
  matcher: [
    {
      // Skip all internal paths
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\..*).*)",
    },
  ],
};
