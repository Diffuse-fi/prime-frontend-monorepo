import { createNavigation } from "next-intl/navigation";

import { localizationRouting } from "./routing";

export const { getPathname, Link, redirect, usePathname, useRouter } =
  createNavigation(localizationRouting);
