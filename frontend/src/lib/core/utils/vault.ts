import { VaultRiskLevel } from "../types";

const vaultriskLevelColorMap: Record<
  VaultRiskLevel,
  "success" | "warning" | "error" | "muted"
> = {
  0: "muted",
  1: "success",
  2: "warning",
  3: "error",
};

export function getVaultRiskLevelColor(riskLevel: VaultRiskLevel) {
  return vaultriskLevelColorMap[riskLevel] || "muted";
}
