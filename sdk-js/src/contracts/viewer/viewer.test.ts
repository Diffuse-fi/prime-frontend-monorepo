import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../abi", () => ({
  viewerAbi: [
    { type: "function", name: "dummy", stateMutability: "view", inputs: [], outputs: [] },
  ] as any,
}));

const MOCK_ADDR = "0x000000000000000000000000000000000000dEaD";

vi.mock("../../addresses/resolve", () => ({
  resolveAddress: vi.fn(() => MOCK_ADDR),
}));

const abortableSpy = vi.fn(<T>(p: Promise<T>) => p);
vi.mock("race-signal", () => ({
  raceSignal: abortableSpy,
  default: { raceSignal: abortableSpy },
}));

const normalizeErrorMock = vi.fn((e: unknown, _ctx: unknown) => {
  const err = e instanceof Error ? e : new Error(String(e));
  (err as any).__normalized = true;
  return err;
});
vi.mock("@/errors/normalize", () => ({
  normalizeError: normalizeErrorMock,
}));

const getVaultsMock = vi.fn();
const getAssetsMock = vi.fn();
const getStrategiesMock = vi.fn();

vi.mock("viem", async orig => {
  const actual: any = await (orig as any)();
  return {
    ...actual,
    getContract: vi.fn(() => ({
      read: {
        getVaults: getVaultsMock,
        getAssets: getAssetsMock,
        getStrategies: getStrategiesMock,
      },
    })),
  };
});

import { Viewer } from "../index";
import { resolveAddress } from "../../addresses/resolve";
import { getContract } from "viem";

describe("Viewer contract wrapper", () => {
  const chainId = 1;

  const publicClient = {
    simulateContract: vi.fn(),
  };

  const init = {
    chainId,
    address: undefined,
    client: { public: publicClient },
  } as const;

  beforeEach(() => {
    vi.clearAllMocks();
    getVaultsMock.mockResolvedValue(["v1", "v2"]);
    getAssetsMock.mockResolvedValue(["a1", "a2"]);
    getStrategiesMock.mockResolvedValue(["s1", "s2"]);
    publicClient.simulateContract.mockResolvedValue({ result: "SIM-RESULT" });
  });

  describe("address resolution & getContract wiring", () => {
    it("uses resolveAddress and viem.getContract with public client", async () => {
      const v = new Viewer(init);
      await v.getVaults();

      expect(resolveAddress).toHaveBeenCalledWith({
        chainId,
        contract: "Viewer",
        addressOverride: undefined,
      });

      expect(getContract).toHaveBeenCalledWith(
        expect.objectContaining({
          address: MOCK_ADDR,
          abi: expect.any(Array),
          client: { public: init.client.public },
        })
      );
    });
  });

  describe("getVaults()", () => {
    it("returns data on success and pipes through abortable", async () => {
      const v = new Viewer(init);
      const res = await v.getVaults();
      expect(res).toEqual(["v1", "v2"]);
      expect(getVaultsMock).toHaveBeenCalledTimes(1);
      expect(abortableSpy).toHaveBeenCalledTimes(1);
      const [promiseArg] = abortableSpy.mock.calls[0];
      expect(promiseArg).toBeInstanceOf(Promise);
    });

    it("normalizes errors with proper context", async () => {
      const rawErr = new Error("boom");
      getVaultsMock.mockRejectedValueOnce(rawErr);

      const v = new Viewer(init);
      await expect(v.getVaults()).rejects.toMatchObject({ __normalized: true });

      expect(normalizeErrorMock).toHaveBeenCalledWith(rawErr, {
        op: "getVaults",
        contract: "Viewer",
        chainId,
      });
    });
  });

  describe("getAssets(vault)", () => {
    const vault = "0x0000000000000000000000000000000000000001" as const;

    it("calls read.getAssets with [vault] and returns data", async () => {
      const v = new Viewer(init);
      const res = await v.getAssets(vault);
      expect(res).toEqual(["a1", "a2"]);
      expect(getAssetsMock).toHaveBeenCalledWith([vault]);
      expect(abortableSpy).toHaveBeenCalledTimes(1);
    });

    it("normalizes errors on failure", async () => {
      const rawErr = new Error("assets-fail");
      getAssetsMock.mockRejectedValueOnce(rawErr);

      const v = new Viewer(init);
      await expect(v.getAssets(vault)).rejects.toMatchObject({ __normalized: true });

      expect(normalizeErrorMock).toHaveBeenCalledWith(rawErr, {
        op: "getAssets",
        contract: "Viewer",
        chainId,
      });
    });
  });

  describe("getStrategies(vault)", () => {
    const vault = "0x0000000000000000000000000000000000000002" as const;

    it("calls read.getStrategies with [vault] and returns data", async () => {
      const v = new Viewer(init);
      const res = await v.getStrategies(vault);
      expect(res).toEqual(["s1", "s2"]);
      expect(getStrategiesMock).toHaveBeenCalledWith([vault]);
      expect(abortableSpy).toHaveBeenCalledTimes(1);
    });

    it("normalizes errors on failure", async () => {
      const rawErr = new Error("strategies-fail");
      getStrategiesMock.mockRejectedValueOnce(rawErr);

      const v = new Viewer(init);
      await expect(v.getStrategies(vault)).rejects.toMatchObject({ __normalized: true });

      expect(normalizeErrorMock).toHaveBeenCalledWith(rawErr, {
        op: "getStrategies",
        contract: "Viewer",
        chainId,
      });
    });
  });

  describe("previewEnterStrategy(vault, strategyId)", () => {
    const vault = "0x0000000000000000000000000000000000000003" as const;
    const strategyId = 123n;

    it("calls public.simulateContract with resolved address and returns result", async () => {
      const v = new Viewer(init);
      const res = await v.previewEnterStrategy(vault, strategyId);

      expect(publicClient.simulateContract).toHaveBeenCalledWith(
        expect.objectContaining({
          address: MOCK_ADDR,
          functionName: "previewEnterStrategy",
          args: [vault, strategyId],
          abi: expect.any(Array),
        })
      );
      expect(res).toBe("SIM-RESULT");
    });

    it("normalizes errors on failure", async () => {
      const rawErr = new Error("simulate-fail");
      publicClient.simulateContract.mockRejectedValueOnce(rawErr);

      const v = new Viewer(init);
      await expect(v.previewEnterStrategy(vault, strategyId)).rejects.toMatchObject({
        __normalized: true,
      });

      expect(normalizeErrorMock).toHaveBeenCalledWith(rawErr, {
        op: "previewEnterStrategy",
        contract: "Viewer",
        chainId,
      });
    });
  });
});
