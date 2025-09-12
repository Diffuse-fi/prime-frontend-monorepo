import createMiddleware from "next-intl/middleware";
import { localizationRouting } from "@/lib/localization/routing";
import { MW } from "./utils";

export const localizationMiddleware: MW = createMiddleware(localizationRouting);
