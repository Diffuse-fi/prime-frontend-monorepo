import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const aliasMap = new Map([
  ["1", 1],
  ["mainnet", 1],
]);

let queryObj: { chain?: unknown } = {};
const setQuery = vi.fn();

let readonlyChainId = 1;
const setReadonlyChainId = vi.fn();

let isConnected = false;
let walletChainId: number | undefined = 1;
let switchChainAsync:
  | ((args: { chainId: number }) => Promise<{ id: number }>)
  | undefined;

const toast = vi.fn();
const chainLogger = { warn: vi.fn() };

vi.mock(
  "@/lib/chains",
  () => ({
    getChainById: (chainId: number) =>
      chainId === 1 ? { id: 1, name: "Mainnet" } : undefined,
  }),
  { virtual: true }
);

vi.mock(
  "@/lib/chains/query",
  () => ({
    formatChainQueryValue: (chainId: number) =>
      chainId === 1 ? "mainnet" : String(chainId),
    getChainQueryValue: (value: unknown) =>
      typeof value === "string" && value.trim() ? value.trim() : undefined,
    parseChainQueryValue: (value: unknown) => {
      const raw = typeof value === "string" && value.trim() ? value.trim() : undefined;
      if (!raw) return null;
      return aliasMap.get(raw) ?? null;
    },
  }),
  { virtual: true }
);

vi.mock("@/lib/toast", () => ({ toast }));
vi.mock("@/lib/core/utils/loggers", () => ({ chainLogger }));

const { useChainQuerySync } = await import("./useChainQuerySync");

const renderSync = () =>
  renderHook(() =>
    useChainQuerySync({
      isConnected,
      queryObj,
      readonlyChainId,
      setQuery,
      setReadonlyChainId,
      switchChainAsync,
      walletChainId,
    })
  );

describe("useChainQuerySync", () => {
  beforeEach(() => {
    queryObj = {};
    readonlyChainId = 1;
    isConnected = false;
    walletChainId = 1;
    switchChainAsync = undefined;
    setQuery.mockReset();
    setReadonlyChainId.mockReset();
    toast.mockReset();
    chainLogger.warn.mockReset();
  });

  it("removes unsupported chain query values", async () => {
    queryObj = { chain: "unsupported" };

    renderSync();

    await waitFor(() =>
      expect(setQuery).toHaveBeenCalledWith({ chain: undefined }, { replace: true })
    );
    expect(setReadonlyChainId).not.toHaveBeenCalled();
  });

  it("sets readonly chain when disconnected and query is supported", async () => {
    queryObj = { chain: "mainnet" };
    readonlyChainId = 5;

    renderSync();

    await waitFor(() => expect(setReadonlyChainId).toHaveBeenCalledWith(1));
    expect(setQuery).not.toHaveBeenCalled();
  });

  it("uses wallet chain when connected and no switch is available", async () => {
    queryObj = { chain: "mainnet" };
    isConnected = true;
    walletChainId = 5;
    readonlyChainId = 5;

    renderSync();

    await waitFor(() =>
      expect(setQuery).toHaveBeenCalledWith({ chain: "5" }, { replace: true })
    );
    expect(setReadonlyChainId).not.toHaveBeenCalled();
  });

  it("sets readonly chain when wallet is already on target", async () => {
    queryObj = { chain: "1" };
    isConnected = true;
    walletChainId = 1;
    readonlyChainId = 5;

    renderSync();

    await waitFor(() => expect(setReadonlyChainId).toHaveBeenCalledWith(1));
    expect(setQuery).not.toHaveBeenCalled();
  });

  it("updates readonly chain when switch succeeds", async () => {
    queryObj = { chain: "mainnet" };
    isConnected = true;
    walletChainId = 5;
    readonlyChainId = 5;
    switchChainAsync = vi.fn(async () => ({ id: 1 }));

    renderSync();

    await waitFor(() => expect(setReadonlyChainId).toHaveBeenCalledWith(1));
    expect(setQuery).not.toHaveBeenCalled();
  });

  it("restores query when switch resolves to a different chain", async () => {
    queryObj = { chain: "mainnet" };
    isConnected = true;
    walletChainId = 5;
    readonlyChainId = 5;
    switchChainAsync = vi.fn(async () => ({ id: 5 }));

    renderSync();

    await waitFor(() =>
      expect(setQuery).toHaveBeenCalledWith({ chain: "5" }, { replace: true })
    );
    expect(setReadonlyChainId).not.toHaveBeenCalled();
  });

  it("restores query and notifies when switch fails", async () => {
    queryObj = { chain: "mainnet" };
    isConnected = true;
    walletChainId = 5;
    readonlyChainId = 5;
    switchChainAsync = vi.fn(async () => {
      throw new Error("fail");
    });

    renderSync();

    await waitFor(() =>
      expect(setQuery).toHaveBeenCalledWith({ chain: "5" }, { replace: true })
    );
    expect(setReadonlyChainId).not.toHaveBeenCalled();
  });
});
