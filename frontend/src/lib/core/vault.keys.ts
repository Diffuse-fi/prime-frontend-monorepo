import type { Address } from "viem";
import { qk, opt } from "@/lib/query/helpers";
import { QV } from "@/lib/query/versions";

const ROOT = "vault" as const;
const version = QV.vault;

export const vaultKeys = {
  root: (vault: Address | null) => qk(ROOT, version, opt(vault)),

  liquidity: (vault: Address | null) => qk(ROOT, version, opt(vault), "liquidity"),
  borrowApr: (vault: Address | null) => qk(ROOT, version, opt(vault), "borrowApr"),

  totalAssets: (vault: Address | null) => qk(ROOT, version, opt(vault), "totalAssets"),
  balanceOf: (vault: Address | null, user: Address | null) =>
    qk(ROOT, version, opt(vault), "balanceOf", opt(user)),
  positions: (vault: Address | null, user: Address | null) =>
    qk(ROOT, version, opt(vault), "positions", opt(user)),

  allForVault(vault: Address | null) {
    return [
      this.liquidity(vault),
      this.borrowApr(vault),
      this.totalAssets(vault),
    ] as const;
  },
  allForUser(vault: Address | null, user: Address | null) {
    return [this.balanceOf(vault, user), this.positions(vault, user)] as const;
  },
};
