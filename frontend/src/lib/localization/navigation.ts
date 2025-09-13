import { createNavigation } from "next-intl/navigation";
import { localizationRouting } from "./routing";

export const { Link, useRouter, usePathname, redirect, getPathname } =
  createNavigation(localizationRouting);
