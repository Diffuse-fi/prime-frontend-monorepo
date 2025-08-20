import { localizationMiddleware } from "./middlewares/localization";
import { chain } from "./middlewares/utils";

export default chain(localizationMiddleware);

export const config = {
  matcher: [
    // Skip all internal paths
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
