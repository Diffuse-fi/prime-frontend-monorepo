import type { TxInfo, TxState, VaultFullInfo } from "../types";

import { applySlippageBpsArray } from "@diffuse/sdk-js";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { type Address, getAddress, type Hash } from "viem";

import { env } from "@/env";
import { trackEvent } from "@/lib/analytics";
import { getPtAmount } from "@/lib/api/pt";
import { calcBorrowingFactor } from "@/lib/formulas/borrow";
import { getSlippageBpsFromKey } from "@/lib/formulas/slippage";
import { makeIdempotencyKey } from "@/lib/misc/idempotency";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { isUserRejectedError } from "../utils/errors";
import { borrowLogger, loggerMut } from "../utils/loggers";

/**
 * Aegis borrow is typically multi-step:
 *  - Step 1: on-chain "init/stage" (may create position / move funds into adapter staging)
 *  - Step 2: off-chain Prime API call to get encoded route data
 *  - Step 3: on-chain "execute/finalize" using encoded route data
 *
 * You asked for placeholders if unknown — look for `TODO(AEGIS): ...`
 */

export type AegisStage =
  | "api-route"
  | "checking"
  | "error"
  | "idle"
  | "pending-settlement"
  | "step1-awaiting-signature"
  | "step1-confirmed"
  | "step1-pending"
  | "step2-awaiting-signature"
  | "step2-pending"
  | "success";

export type BorrowResult = {
  error?: Error;
  hash?: Hash;
};

export type SelectedBorrow = {
  address: Address;
  assetDecimals?: number;
  assetsToBorrow: bigint;
  assetSymbol?: string;
  chainId: number;
  collateralAmount: bigint;
  collateralType: number;
  deadline: bigint;
  /**
   * Optional: if you already know it from UI or resume-state.
   * If not provided, hook will try to extract/fetch it after step1.
   */
  positionId?: bigint;
  slippage: string;

  strategyId: bigint;
};

export type UseAegisBorrowParams = {
  /**
   * REQUIRED for Aegis: you must provide how to get route info needed by Prime API.
   * Usually comes from Viewer: e.g. getRouteInfoForBorrow(vault, positionId) => ...
   */
  getRouteInfoForBorrow?: (args: {
    chainId: number;
    positionId: bigint;
    vaultAddress: Address;
    wallet: Address;
  }) => Promise<unknown>;
  /**
   * Optional: some Aegis flows need polling until "ready".
   * Provide a function that returns true when the borrow is fully finalized.
   */
  isBorrowFinalized?: (args: {
    chainId: number;
    positionId: bigint;
    vaultAddress: Address;
    wallet: Address;
  }) => Promise<boolean>;
  onBorrowComplete?: (result: BorrowResult) => void;

  onBorrowError?: (errorMessage: string, address: Address) => void;

  onBorrowSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type UseAegisBorrowResult = {
  allConfirmed: boolean;
  borrow: () => Promise<BorrowResult>;
  isPending: boolean;
  /** Useful for rendering “resume” / links */
  positionId: bigint | null;
  reset: () => void;
  someAwaitingSignature: boolean;
  someError: boolean;

  /** Aegis-specific UX state (stepper/progress UI) */
  stage: AegisStage;

  txState: TxState;
};

const ROOT = "aegisBorrow" as const;
const version = QV.borrow;
const qKeys = {
  borrow: (chainId: number | undefined, address: Address | undefined) =>
    qk([ROOT, version, opt(chainId), opt(address)]),
};

const WAD = 10n ** 18n;
const LTV_WAD = 950_000_000_000_000_000n; // 95%
const mulWad = (x: bigint, y: bigint) => (x * y) / WAD;
const divWad = (x: bigint, y: bigint) => (x * WAD) / y;

const STORAGE_KEY = "aegis-borrow-progress:v1";

/** persisted so refresh doesn’t brick a partially completed Aegis flow */
type Persisted = {
  chainId: number;
  encodedData?: `0x${string}`;
  idemKey: string;
  positionId?: string; // bigint string
  stage: AegisStage;
  updatedAt: number;
  vaultAddress: Address;
  wallet: Address;
};

export function useAegisBorrow(
  selected: null | SelectedBorrow,
  vault: null | VaultFullInfo,
  {
    getRouteInfoForBorrow,
    isBorrowFinalized,
    onBorrowComplete,
    onBorrowError,
    onBorrowSuccess,
  }: UseAegisBorrowParams = {}
): UseAegisBorrowResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingKey, setPendingKey] = useState<null | string>(null);
  const [stage, setStage] = useState<AegisStage>("idle");
  const [positionId, setPositionId] = useState<bigint | null>(null);

  const { address: wallet, chainId, publicClient } = useClients();

  const enabled =
    !!selected &&
    !!wallet &&
    !!publicClient &&
    !!vault &&
    selected.chainId === chainId &&
    getAddress(selected.address) === getAddress(vault.address);

  const addr = useMemo(
    () => (selected ? getAddress(selected.address) : undefined),
    [selected]
  );

  const setPhase = (addr0: Address, info: Partial<TxInfo>) =>
    setTxState(
      produce(prev => {
        prev[addr0] = { ...(prev[addr0] as TxInfo | undefined), ...info } as TxInfo;
      })
    );

  // Attempt auto-resume from localStorage when inputs match
  useEffect(() => {
    if (!enabled || !selected || !addr || !wallet) return;

    const idemKey = makeIdempotencyKey(
      chainId!,
      addr,
      getAddress(wallet),
      selected.address,
      selected.strategyId,
      selected.collateralType,
      selected.collateralAmount,
      selected.assetsToBorrow,
      selected.slippage,
      selected.deadline,
      "aegis"
    );

    const p = readPersisted();
    if (!p) return;

    const same =
      p.idemKey === idemKey &&
      p.chainId === chainId! &&
      getAddress(p.vaultAddress) === addr &&
      getAddress(p.wallet) === getAddress(wallet);

    if (!same) return;

    setStage(p.stage);
    if (p.positionId) setPositionId(BigInt(p.positionId));
  }, [enabled, selected, addr, wallet, chainId]);

  const borrowMutation = useMutation({
    mutationFn: async (): Promise<BorrowResult> => {
      const result: BorrowResult = {};

      if (!enabled || !selected || !addr || !wallet) return result;

      const idemKey = makeIdempotencyKey(
        chainId!,
        addr,
        getAddress(wallet),
        selected.address,
        selected.strategyId,
        selected.collateralType,
        selected.collateralAmount,
        selected.assetsToBorrow,
        selected.slippage,
        selected.deadline,
        "aegis"
      );

      const currentPhase = (txState[addr]?.phase ?? "idle") as TxInfo["phase"];
      const active =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";
      if (active || pendingKey === idemKey) return result;

      // Basic validation
      if (selected.collateralAmount <= 0n) {
        const e = new Error("Collateral must be greater than zero");
        setPhase(addr, { errorMessage: e.message, phase: "error" });
        setStage("error");
        result.error = e;
        onBorrowError?.(e.message, addr);
        onBorrowComplete?.(result);
        return result;
      }
      if (selected.assetsToBorrow <= 0n) {
        const e = new Error("Borrow amount must be greater than zero");
        setPhase(addr, { errorMessage: e.message, phase: "error" });
        setStage("error");
        result.error = e;
        onBorrowError?.(e.message, addr);
        onBorrowComplete?.(result);
        return result;
      }

      setPhase(addr, { phase: "checking" });
      setStage("checking");

      try {
        setPendingKey(idemKey);

        // Restore persisted if available
        const persisted = readPersisted();
        const canResume =
          persisted &&
          persisted.idemKey === idemKey &&
          persisted.chainId === chainId! &&
          getAddress(persisted.vaultAddress) === addr &&
          getAddress(persisted.wallet) === getAddress(wallet);

        let localStage: AegisStage = canResume ? persisted!.stage : "idle";
        let localPositionId: bigint | undefined =
          selected.positionId ??
          positionId ??
          (canResume && persisted?.positionId ? BigInt(persisted.positionId) : undefined);
        let encodedData: `0x${string}` | undefined = canResume
          ? persisted?.encodedData
          : undefined;

        const persist = (patch: Partial<Persisted>) => {
          const next: Persisted = {
            chainId: chainId!,
            encodedData: (patch.encodedData ?? encodedData) as any,
            idemKey,
            positionId: (patch.positionId ?? localPositionId?.toString()) as any,
            stage: patch.stage ?? localStage,
            updatedAt: Date.now(),
            vaultAddress: addr,
            wallet: getAddress(wallet),
          };
          writePersisted(next);
        };

        // ===== Common math (same as regular borrow) =====
        const strategy = vault.strategies.find(s => s.id === selected.strategyId);
        if (!strategy) throw new Error("Strategy not found");

        const secondsLeft = BigInt(
          Math.max(0, Number(strategy.endDate) - Math.floor(Date.now() / 1000))
        );

        const borrowingFactor = calcBorrowingFactor(
          strategy.apr,
          vault.feeData.spreadFee,
          secondsLeft
        );

        const assetDec = selected.assetDecimals ?? vault.assets[0].decimals;
        const stratDec = strategy.token.decimals;

        const factorWad = calcFactorWad(
          borrowingFactor,
          vault.feeData.liquidationFee,
          vault.feeData.earlyWithdrawalFee
        );

        let predictedRouteAmounts: readonly bigint[];
        let totalStrategyTokens: bigint;
        let denomBase: bigint;
        let collateralValueBase: bigint;

        if (selected.collateralType === 1) {
          // PT path simulation is off-chain in your codebase, keep it the same
          const sim = await getPtAmount({
            strategy_id: selected.strategyId.toString(),
            usdc_amount: selected.assetsToBorrow.toString(),
            vault_address: addr,
          });
          if (!sim.finished) throw new Error("PT simulation not finished");

          predictedRouteAmounts = sim.amounts.map(BigInt);
          const ptOut = predictedRouteAmounts.at(-1);
          if (ptOut === undefined)
            throw new Error("PT simulation returned empty amounts");

          totalStrategyTokens = ptOut + selected.collateralAmount;

          collateralValueBase =
            ptOut === 0n
              ? 0n
              : (selected.collateralAmount * selected.assetsToBorrow) / ptOut;

          denomBase = selected.assetsToBorrow + collateralValueBase;
        } else {
          predictedRouteAmounts = await vault.contract.previewBorrow([
            wallet,
            selected.strategyId,
            selected.collateralType,
            selected.collateralAmount,
            selected.assetsToBorrow,
          ]);

          const lastAmount = predictedRouteAmounts.at(-1);
          if (lastAmount === undefined)
            throw new Error("previewBorrow returned empty assetsReceived");

          totalStrategyTokens = lastAmount;
          collateralValueBase = selected.collateralAmount;
          denomBase = selected.assetsToBorrow + selected.collateralAmount;
        }

        if (denomBase === 0n) throw new Error("Zero denominator");

        const leverage =
          collateralValueBase === 0n
            ? 0
            : Number(selected.assetsToBorrow + collateralValueBase) /
              Number(collateralValueBase);

        const borrowedShareWad = divWad(selected.assetsToBorrow, denomBase);

        const depositPriceWad =
          totalStrategyTokens === 0n
            ? 0n
            : (totalStrategyTokens * WAD * 10n ** BigInt(assetDec)) /
              (denomBase * 10n ** BigInt(stratDec));

        const liquidationPriceBeforeLtv =
          depositPriceWad === 0n
            ? 0n
            : divWad(mulWad(factorWad, borrowedShareWad), depositPriceWad);

        const resultWad = divWad(liquidationPriceBeforeLtv, LTV_WAD);

        const bps = getSlippageBpsFromKey(selected.slippage);
        const minStrategyToReceive = applySlippageBpsArray(
          predictedRouteAmounts,
          bps,
          "down"
        );

        trackEvent("aegis_borrow_request_start", {
          amount: selected.assetsToBorrow.toString(),
          asset_symbol: selected.assetSymbol,
          chain_id: chainId!,
          leverage,
          vault_address: addr,
        });

        // ======================
        // STEP 1: on-chain init
        // ======================
        if (
          localStage === "idle" ||
          localStage === "checking" ||
          localStage === "step1-awaiting-signature" ||
          localStage === "step1-pending"
        ) {
          setPhase(addr, { phase: "awaiting-signature" });
          setStage("step1-awaiting-signature");
          localStage = "step1-awaiting-signature";
          persist({ stage: localStage });

          // TODO(AEGIS): replace with your actual init method for Aegis borrow.
          // Often differs from regular borrowRequest (or same method but strategy/adapter encodes Aegis).
          const hash1 = await aegisBorrowInitTx(vault, {
            assetsToBorrow: selected.assetsToBorrow,
            collateralAmount: selected.collateralAmount,
            collateralType: selected.collateralType,
            deadline: selected.deadline,
            liquidationPriceWad: resultWad,
            minStrategyToReceive,
            strategyId: selected.strategyId,
          });

          setPhase(addr, { hash: hash1, phase: "pending" });
          setStage("step1-pending");
          localStage = "step1-pending";
          persist({ stage: localStage });
          result.hash = hash1;

          const receipt1 = await publicClient!.waitForTransactionReceipt({
            hash: hash1,
            onReplaced: r => {
              setPhase(addr, { hash: r.transaction.hash, phase: "replaced" });
              result.hash = r.transaction.hash;
            },
          });

          if (receipt1.status !== "success")
            throw new Error("Step 1 transaction reverted");

          // TODO(AEGIS): determine positionId. Options:
          //  - decode event logs from receipt1
          //  - query viewer for latest position for wallet in this vault
          if (!localPositionId) {
            localPositionId = await resolveAegisPositionId({
              chainId: chainId!,
              receipt: receipt1,
              vault,
              vaultAddress: addr,
              wallet: getAddress(wallet),
            });
          }
          if (!localPositionId)
            throw new Error("Could not resolve positionId after Aegis init");

          setPositionId(localPositionId);
          setStage("step1-confirmed");
          localStage = "step1-confirmed";
          persist({ positionId: localPositionId.toString(), stage: localStage });
        }

        // =========================
        // STEP 2: call Prime API
        // =========================
        if (!encodedData) {
          if (!getRouteInfoForBorrow) {
            throw new Error(
              "getRouteInfoForBorrow is required for useAegisBorrow (Viewer → Prime API)."
            );
          }

          setStage("api-route");
          localStage = "api-route";
          persist({ stage: localStage });

          const routeInfo = await getRouteInfoForBorrow({
            chainId: chainId!,
            positionId: localPositionId!,
            vaultAddress: addr,
            wallet: getAddress(wallet),
          });

          // TODO(AEGIS): confirm endpoint + request/response schema.
          encodedData = await postPrimeAegisMint({
            apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL,
            chainId: chainId!,
            idempotencyKey: idemKey,
            positionId: localPositionId!,
            routeInfo,
            slippageBps: bps,
            vaultAddress: addr,
          });

          persist({ encodedData });
        }

        // ==========================
        // STEP 3: on-chain execute
        // ==========================
        setPhase(addr, { phase: "awaiting-signature" });
        setStage("step2-awaiting-signature");
        localStage = "step2-awaiting-signature";
        persist({ stage: localStage });

        // TODO(AEGIS): replace with your real execute/finalize method.
        const hash2 = await aegisBorrowExecuteTx(vault, {
          encodedData: encodedData!,
          positionId: localPositionId!,
        });

        setPhase(addr, { hash: hash2, phase: "pending" });
        setStage("step2-pending");
        localStage = "step2-pending";
        persist({ stage: localStage });
        result.hash = hash2;

        const receipt2 = await publicClient!.waitForTransactionReceipt({
          hash: hash2,
          onReplaced: r => {
            setPhase(addr, { hash: r.transaction.hash, phase: "replaced" });
            result.hash = r.transaction.hash;
          },
        });

        if (receipt2.status !== "success") throw new Error("Step 3 transaction reverted");

        // ==========================
        // Optional: settlement polling
        // ==========================
        if (isBorrowFinalized) {
          setStage("pending-settlement");
          localStage = "pending-settlement";
          persist({ stage: localStage });

          // Basic polling loop (adjust interval/timeout as you like)
          const started = Date.now();
          const timeoutMs = 60_000; // TODO(AEGIS): tune or remove
          const intervalMs = 2000;

          while (true) {
            const ok = await isBorrowFinalized({
              chainId: chainId!,
              positionId: localPositionId!,
              vaultAddress: addr,
              wallet: getAddress(wallet),
            });
            if (ok) break;

            if (Date.now() - started > timeoutMs) {
              // Not a hard error; position may still finalize later. Keep progress saved.
              break;
            }

            await new Promise(r => setTimeout(r, intervalMs));
          }
        }

        // Done
        setPhase(addr, { hash: receipt2.transactionHash, phase: "success" });
        setStage("success");
        writePersisted(null);

        trackEvent("aegis_borrow_request_success", {
          amount: selected.assetsToBorrow.toString(),
          asset_symbol: selected.assetSymbol,
          chain_id: chainId!,
          transaction_hash: receipt2.transactionHash,
          vault_address: addr,
        });

        onBorrowSuccess?.(addr, receipt2.transactionHash);
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase(addr, { phase: "idle" });
          setStage("idle");
          trackEvent("aegis_borrow_request_rejected", {
            amount: selected.assetsToBorrow.toString(),
            asset_symbol: selected.assetSymbol,
            chain_id: chainId!,
            vault_address: addr,
          });
          borrowLogger.info("aegis borrow cancelled by user", { address: addr });
          return result;
        }

        const e = error instanceof Error ? error : new Error("Unknown error");
        setPhase(addr, { errorMessage: e.message, phase: "error" });
        setStage("error");
        result.error = e;

        trackEvent("aegis_borrow_request_error", {
          amount: selected.assetsToBorrow.toString(),
          asset_symbol: selected.assetSymbol,
          chain_id: chainId!,
          error_message: e.message,
          vault_address: addr,
        });

        onBorrowError?.(e.message, addr);
        loggerMut.error("mutation error (aegis borrow)", {
          address: addr,
          error: e,
          mutationKey: qKeys.borrow(chainId, addr),
        });
      } finally {
        setPendingKey(k => (k === idemKey ? null : k));
        onBorrowComplete?.(result);
      }

      return result;
    },
    mutationKey: qKeys.borrow(chainId, addr),
  });

  const borrow = borrowMutation.mutateAsync;

  const allConfirmed =
    Object.keys(txState).length > 0 &&
    Object.values(txState).every(s => s.phase === "success");

  const someError = Object.values(txState).some(s => s.phase === "error");
  const someAwaitingSignature = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

  const reset = () => {
    setTxState({});
    setPendingKey(null);
    setStage("idle");
    setPositionId(null);
    writePersisted(null);
    borrowMutation.reset();
  };

  return {
    allConfirmed,
    borrow,
    isPending: borrowMutation.isPending,
    positionId,
    reset,
    someAwaitingSignature,
    someError,
    stage,
    txState,
  };
}

/**
 * TODO(AEGIS): Step 3 on-chain execute/finalize
 * Replace with your actual method signature.
 */
async function aegisBorrowExecuteTx(
  vault: VaultFullInfo,
  args: { encodedData: `0x${string}`; positionId: bigint }
): Promise<Hash> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = vault.contract;

  // TODO(AEGIS): rename to your actual method and encode parameters appropriately
  // Example possibilities:
  //  - c.executeBorrow([args.positionId, args.encodedData])
  //  - c.borrowFinalize([args.positionId, args.encodedData])
  //  - c.borrow([..., args.encodedData])
  if (typeof c.executeBorrow === "function") {
    return c.executeBorrow([args.positionId, args.encodedData]) as Promise<Hash>;
  }

  throw new Error(
    "AEGIS execute method placeholder not wired. Implement aegisBorrowExecuteTx() for your ABI."
  );
}

/**
 * TODO(AEGIS): Step 1 on-chain tx
 * Replace with your actual vault/adapter method name + args.
 */
async function aegisBorrowInitTx(
  vault: VaultFullInfo,
  args: {
    assetsToBorrow: bigint;
    collateralAmount: bigint;
    collateralType: number;
    deadline: bigint;
    liquidationPriceWad: bigint;
    minStrategyToReceive: readonly bigint[];
    strategyId: bigint;
  }
): Promise<Hash> {
  // Placeholder (may be wrong for Aegis).
  // If Aegis uses a different entrypoint, change here.
  return vault.contract.borrowRequest([
    args.strategyId,
    args.collateralType,
    args.collateralAmount,
    args.assetsToBorrow,
    args.liquidationPriceWad,
    args.minStrategyToReceive,
    args.deadline,
  ]);
}

function calcFactorWad(
  borrowingFactorBps: bigint | number,
  liquidationFee: number,
  earlyWithdrawalFee: number
): bigint {
  const bps = toBpsBigint(borrowingFactorBps);
  const borrowingFactorWad = (bps * WAD) / 10_000n;

  const protocolMaxFee = Math.max(liquidationFee, earlyWithdrawalFee);
  const protocolMaxFeeWad = (BigInt(protocolMaxFee) * WAD) / 10_000n;

  return WAD + borrowingFactorWad + protocolMaxFeeWad;
}

/**
 * TODO(AEGIS): implement your Prime API call for "borrow entrance" (mint)
 * Align endpoint + payload to your real API docs.
 */
async function postPrimeAegisMint(args: {
  apiBaseUrl: string;
  chainId: number;
  idempotencyKey: string;
  positionId: bigint;
  routeInfo: unknown;
  slippageBps: number;
  vaultAddress: Address;
}): Promise<`0x${string}`> {
  // TODO(AEGIS): change endpoint path
  const url = new URL("/api/mint", args.apiBaseUrl).toString();

  const res = await fetch(url, {
    body: JSON.stringify({
      chain_id: args.chainId,
      position_id: args.positionId.toString(),
      route_info: args.routeInfo,
      slippage_bps: args.slippageBps,
      vault_address: args.vaultAddress,
    }),
    headers: {
      "content-type": "application/json",
      "x-idempotency-key": args.idempotencyKey,
    },
    method: "POST",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Prime API mint failed (${res.status}): ${text || res.statusText}`);
  }

  const json = (await res.json()) as { encoded_data?: `0x${string}` };
  if (!json.encoded_data) throw new Error("Prime API mint response missing encoded_data");
  return json.encoded_data;
}

function readPersisted(): null | Persisted {
  if (globalThis.window === undefined) return null;
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

/**
 * TODO(AEGIS): obtain positionId after step1.
 * Best: decode event logs in receipt. Alternative: query Viewer for latest position.
 */
async function resolveAegisPositionId(args: {
  chainId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receipt: any;
  vault: VaultFullInfo;
  vaultAddress: Address;
  wallet: Address;
}): Promise<bigint | undefined> {
  // TODO(AEGIS): implement one of:
  // 1) decode logs from args.receipt using publicClient.decodeEventLog + vault ABI
  // 2) query viewer: getPositions(wallet, vault) and pick newest
  return undefined;
}

function toBpsBigint(v: bigint | number): bigint {
  if (typeof v === "bigint") return v;
  if (!Number.isFinite(v)) return 0n;
  return BigInt(Math.floor(v));
}

function writePersisted(v: null | Persisted) {
  if (globalThis.window === undefined) return;
  try {
    if (v) {
      globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    } else {
      globalThis.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}
