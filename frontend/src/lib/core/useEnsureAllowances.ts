import { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";
import {
  erc20Abi,
  maxUint256,
  type Address,
  BaseError,
  ContractFunctionRevertedError,
} from "viem";
import { useQuery } from "@tanstack/react-query";
import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useClients } from "../wagmi/useClients";
import { SelectedVault } from "./types";
import { produce } from "immer";

export type ApprovalPolicy = "exact" | "infinite";
export type AllowanceStatus = "ok" | "missing" | "insufficient" | "unknown";

export type VaultAllowance = {
  vault: SelectedVault;
  current: bigint | null;
  status: AllowanceStatus;
};

type Pending = Record<`${Address}:${Address}`, boolean>;

export type EnsureAllowancesResult = {
  data: VaultAllowance[] | undefined;
  ready: boolean;
  isLoading: boolean;
  approveMissing: (opts?: { mode?: ApprovalPolicy }) => Promise<void>;
  pending: Pending;
  error: Error | null;
  enabled: boolean;
};

const ROOT = "allowance-erc20";
const qKeys = {
  allowances: (
    chainId: number | undefined,
    assets: string | undefined,
    amounts: string | undefined,
    owner: Address | undefined,
    spenders: string | undefined
  ) =>
    qk([
      QV.allowance,
      ROOT,
      opt(chainId),
      opt(assets),
      opt(owner),
      opt(spenders),
    ]),
};

export function useEnsureAllowances(sv: SelectedVault[]): EnsureAllowancesResult {
  const [pending, setPending] = useState<Pending>({});
  const [error, setError] = useState<Error | null>(null);
  const { address: ownerAddr, publicClient, chainId } = useClients();
  const { writeContractAsync } = useWriteContract();
  const enabled = sv?.length > 0 && !!ownerAddr && !!publicClient;
  const addressKey = sv.map(v => v.address.toLowerCase()).join("-") || undefined;
  const assetsKey = sv.map(v => v.assetAddress.toLowerCase()).join("-") || undefined;
  const amountsKey = sv.map(v => v.amount.toString()).join("-") || undefined;

  const { data: allowances, refetch } = useQuery({
    queryKey: qKeys.allowances(chainId, assetsKey, amountsKey, ownerAddr, addressKey),
    enabled,
    queryFn: async (): Promise<VaultAllowance[]> => {
      const calls = sv.map(v => ({
        abi: erc20Abi,
        address: v.assetAddress,
        functionName: "allowance" as const,
        args: [ownerAddr, v.address],
      }));

      try {
        const results = await publicClient!.multicall({ contracts: calls });
        return sv.map((v, i) => {
          const r = results[i];
          const current = r.status === "success" ? (r.result as bigint) : null;
          const status: AllowanceStatus =
            current == null
              ? "unknown"
              : current >= v.amount
                ? "ok"
                : current === 0n
                  ? "missing"
                  : "insufficient";
          return { vault: v, current, status };
        });
      } catch {
        const out: VaultAllowance[] = [];
        for (const v of sv) {
          try {
            const current = await publicClient!.readContract({
              abi: erc20Abi,
              address: v.assetAddress,
              functionName: "allowance",
              args: [ownerAddr!, v.address],
            });
            const status: AllowanceStatus =
              current >= v.amount ? "ok" : current === 0n ? "missing" : "insufficient";
            out.push({ vault: v, current, status });
          } catch {
            out.push({ vault: v, current: null, status: "unknown" });
          }
        }
        return out;
      }
    },
  });

  const approveOne = useCallback(
    async (v: SelectedVault, opts?: { mode?: ApprovalPolicy }) => {
      if (!ownerAddr) throw new Error("WALLET_REQUIRED");

      const key = `${v.assetAddress}:${v.address}` as const;
      setPending(
        produce(draft => {
          draft[key] = true;
        })
      );
      setError(null);

      try {
        const amount = opts?.mode === "infinite" ? maxUint256 : v.amount;

        try {
          await publicClient!.simulateContract({
            abi: erc20Abi,
            address: v.assetAddress,
            functionName: "approve",
            args: [v.address, amount],
            account: ownerAddr,
          });
        } catch (e) {
          throw new Error(e?.shortMessage ?? e?.message ?? "SIMULATION_REVERTED");
        }

        const hash = await writeContractAsync({
          abi: erc20Abi,
          address: v.assetAddress,
          functionName: "approve",
          args: [v.address, amount],
        });

        await publicClient!.waitForTransactionReceipt({ hash });
        await refetch();
      } finally {
        setPending(
          produce(draft => {
            delete draft[key];
          })
        );
      }
    },
    [ownerAddr, publicClient, writeContractAsync, refetch]
  );

  const approveMissing = useCallback(
    async (opts: { mode?: ApprovalPolicy } = {}) => {
      if (!allowances) throw new Error("NO_ALLOWANCES");
      const targets = allowances.filter(x => x.status !== "ok").map(x => x.vault);

      for (const v of targets) {
        await approveOne(v, opts);
      }
    },
    [allowances, approveOne]
  );

  const ready = allowances !== undefined && allowances.every(a => a.status === "ok");

  return {
    pending,
    approveMissing,
    error,
    data: allowances,
    ready,
    isLoading: false,
    enabled,
  };
}

function shortMessage(e: unknown): string {
  if (e instanceof BaseError) return e.shortMessage || e.message;
  if (e instanceof Error) return e.message;
  return "Unknown error";
}
function isRevert(e: unknown): boolean {
  if (e instanceof ContractFunctionRevertedError) return true;
  if (e instanceof BaseError) {
    return e.walk(err => err instanceof ContractFunctionRevertedError) ? true : false;
  }
  return false;
}
function isUserRejected(e: unknown): boolean {
  if (e instanceof BaseError) {
    const m = (e.shortMessage || e.message || "").toLowerCase();
    return (
      m.includes("user rejected") ||
      m.includes("user denied") ||
      m.includes("rejected the request")
    );
  }
  return false;
}
