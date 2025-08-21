import { version as pkgVersion } from "../package.json" with { type: "json" };

export const version = pkgVersion;
