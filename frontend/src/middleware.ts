import { cspMiddleware } from "./middlewares/csp";
import { localizationMiddleware } from "./middlewares/localization";
import { compose } from "./middlewares/utils";

export default compose({
  always: [cspMiddleware],
  stack: [localizationMiddleware],
});

export const config = {
  matcher: [
    {
      // Skip all internal paths
      source: String.raw`/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\..*).*)`,
    },
  ],
};
