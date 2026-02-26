import { getAvailableChains, getChainById } from ".";

const CHAINS = getAvailableChains();

const chainIdByAlias = new Map<string, number>();

function normalizeAlias(value: string): string {
  return value.trim().toLowerCase().split(/\s+/).join("-");
}

for (const chain of CHAINS) {
  chainIdByAlias.set(normalizeAlias(String(chain.id)), chain.id);
  chainIdByAlias.set(normalizeAlias(chain.name), chain.id);
}

const mainnetChain = getChainById(1);
if (mainnetChain) {
  chainIdByAlias.set("mainnet", mainnetChain.id);
}

export function formatChainQueryValue(chainId: number): string {
  if (chainId === 1 && chainIdByAlias.has("mainnet")) {
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
  return chainIdByAlias.get(normalized) ?? null;
}
