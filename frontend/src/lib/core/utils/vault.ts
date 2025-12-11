import { VaultRiskLevel } from "../types";

const vaultriskLevelColorMap: Record<
  VaultRiskLevel,
  "error" | "muted" | "success" | "warning"
> = {
  0: "muted",
  1: "success",
  2: "warning",
  3: "error",
};

export function getVaultRiskLevelColor(riskLevel: VaultRiskLevel) {
  return vaultriskLevelColorMap[riskLevel] || "muted";
}
