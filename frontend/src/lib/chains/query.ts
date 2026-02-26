import { getAvailableChains, getChainById } from ".";

const CHAINS = getAvailableChains();

function normalizeAlias(value: string): string {
  return value.trim().toLowerCase().split(/\s+/).join("-");
}

export function formatChainQueryValue(chainId: number): string {
  const aliasMap = getChainIdByAlias();
  if (chainId === 1 && aliasMap.has("mainnet")) {
    return "mainnet";
  }

  return String(chainId);
}

export function getChainQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const firstString = value.find(entry => typeof entry === "string");
    return typeof firstString === "string" ? firstString : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    return trimmed;
  }

  return undefined;
}

export function parseChainQueryValue(value: unknown): null | number {
  const raw = getChainQueryValue(value);
  if (!raw) return null;

  const normalized = normalizeAlias(raw);
  return getChainIdByAlias().get(normalized) ?? null;
}

function getChainIdByAlias(): Map<string, number> {
  const aliasMap = new Map<string, number>();

  for (const chain of CHAINS) {
    aliasMap.set(normalizeAlias(String(chain.id)), chain.id);
    aliasMap.set(normalizeAlias(chain.name), chain.id);
  }

  const mainnetChain = getChainById(1);
  if (mainnetChain) {
    aliasMap.set("mainnet", mainnetChain.id);
  }

  return aliasMap;
}
