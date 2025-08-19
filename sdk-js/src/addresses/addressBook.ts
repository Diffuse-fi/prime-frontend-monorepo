// packages/sdk/src/config/addressBook.ts
import mainnetJson from "./addresses.mainnet.json";
import testnetsJson from "./addresses.testnets.json";

import { getAddress, isAddress, type Address } from "viem";
import { AddressNotFoundError, InvalidAddressError } from "../errors";

export type ContractName = "LendingVault" | "VaultFactory" | "Curator" | "Liquidator";

export type VersionedEntry = {
  current?: Address; // optional but recommended
  versions?: Record<string, Address>; // semver-like keys
};

export type AddressBook = Record<
  number, // chainId
  Partial<Record<ContractName, VersionedEntry>>
>;

function asAddressUnsafe(x: unknown): Address {
  return x as Address;
}

function normalizeEntry(
  raw: { current?: string; versions?: Record<string, string> },
  ctx: { chainId: number; contract: string }
): VersionedEntry {
  const out: VersionedEntry = {};

  if (raw.current != null) {
    if (!isAddress(raw.current)) {
      throw new InvalidAddressError(raw.current, { ...ctx, field: "current" });
    }
    out.current = getAddress(asAddressUnsafe(raw.current));
  }

  if (raw.versions) {
    out.versions = {};
    for (const [ver, addr] of Object.entries(raw.versions)) {
      if (!isAddress(addr)) {
        throw new InvalidAddressError(addr, { ...ctx, field: `versions.${ver}` });
      }
      out.versions[ver] = getAddress(asAddressUnsafe(addr));
    }
  }

  return out;
}

function normalizeContracts(
  contracts: Record<string, any>,
  chainId: number
): AddressBook[number] {
  const out: AddressBook[number] = {};
  for (const [name, entry] of Object.entries(contracts)) {
    out[name as ContractName] = normalizeEntry(entry, { chainId, contract: name });
  }
  return out;
}

/** ------------ Build the merged book at module load ------------ **/

const BOOK: AddressBook = (() => {
  const merged: AddressBook = {};

  // mainnet.json: { chainId, contracts }
  if (typeof mainnetJson?.chainId === "number" && mainnetJson.contracts) {
    const cid = mainnetJson.chainId as number;
    merged[cid] = {
      ...(merged[cid] ?? {}),
      ...normalizeContracts(mainnetJson.contracts, cid),
    };
  }

  // testnets.json: { chains: { [chainId]: { contracts } } }
  if (testnetsJson?.chains && typeof testnetsJson.chains === "object") {
    for (const [cidStr, cfg] of Object.entries(testnetsJson.chains)) {
      const cid = Number(cidStr);
      if (!Number.isFinite(cid)) continue;
      if (!cfg?.contracts) continue;

      merged[cid] = {
        ...(merged[cid] ?? {}),
        ...normalizeContracts(cfg.contracts, cid),
      };
    }
  }

  return merged;
})();

/** Public constant your resolver imports */
export const ADDRESS_BOOK: AddressBook = BOOK;

/** ------------ Helpers for resolver & consumers ------------ **/

export function getEntryOrThrow(chainId: number, contract: ContractName): VersionedEntry {
  const byChain = ADDRESS_BOOK[chainId];
  const entry = byChain?.[contract];
  if (!entry) {
    throw new AddressNotFoundError({ chainId, contract });
  }
  return entry;
}

export function getAddressFor(
  chainId: number,
  contract: ContractName,
  version?: string
): Address {
  const entry = getEntryOrThrow(chainId, contract);

  if (version) {
    const addr = entry.versions?.[version];
    if (!addr) {
      throw new AddressNotFoundError({ chainId, contract, version });
    }
    return addr;
  }

  if (!entry.current) {
    // Fallback to highest semver if you want; otherwise require 'current'
    throw new AddressNotFoundError({
      chainId,
      contract,
      reason: "no current version set",
    });
  }
  return entry.current;
}

export function listVersions(chainId: number, contract: ContractName): string[] {
  const entry = getEntryOrThrow(chainId, contract);
  return Object.keys(entry.versions ?? {});
}
