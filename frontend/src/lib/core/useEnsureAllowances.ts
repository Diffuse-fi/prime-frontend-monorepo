import { useCallback, useMemo, useState } from "react";
import { useWriteContract } from "wagmi";
import { erc20Abi, maxUint256, type Address, getAddress } from "viem";
import { useQuery } from "@tanstack/react-query";
import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useClients } from "../wagmi/useClients";
import { SelectedVault } from "./types";
import { produce } from "immer";
import { raceSignal as abortable } from "race-signal";
import useIsMountedRef from "use-is-mounted-ref";

export type ApprovalPolicy = "exact" | "infinite";
export type AllowanceStatus = "ok" | "missing" | "insufficient" | "unknown";

export type VaultAllowance = {
  vault: SelectedVault;
  current: bigint | null;
  status: AllowanceStatus;
};

type Pending = Record<`${Address}:${Address}`, boolean>;

export type EnsureAllowancesResult = {
  allowances: VaultAllowance[] | undefined;
  ableToRequest: boolean;
  allAllowed: boolean;
  isPendingAllowances: boolean;
  isPendingApprovals: boolean;
  approveMissing: (opts?: { mode?: ApprovalPolicy }) => Promise<void>;
  pendingApprovals: Pending;
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
      opt(amounts),
      opt(owner),
      opt(spenders),
    ]),
};

export function useEnsureAllowances(sv: SelectedVault[]): EnsureAllowancesResult {
  const [pending, setPending] = useState<Pending>({});
  const [error, setError] = useState<Error | null>(null);
  const { address: ownerAddr, publicClient, chainId } = useClients();
  const isMounted = useIsMountedRef();
  const { writeContractAsync } = useWriteContract();
  const addressKey = sv.map(v => v.address.toLowerCase()).join("-") || undefined;
  const assetsKey = sv.map(v => v.assetAddress.toLowerCase()).join("-") || undefined;
  const amountsKey = sv.map(v => v.amount.toString()).join("-") || undefined;
  const vaultsConsistency = sv.every(v => v.chainId === chainId);
  const enabled = sv?.length > 0 && !!ownerAddr && !!publicClient && vaultsConsistency;

  const {
    data: allowances,
    refetch,
    isPending,
  } = useQuery({
    queryKey: qKeys.allowances(chainId, assetsKey, amountsKey, ownerAddr, addressKey),
    enabled,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 10,
    queryFn: async ({ signal }): Promise<VaultAllowance[]> => {
      const calls = sv.map(v => ({
        abi: erc20Abi,
        address: getAddress(v.assetAddress),
        functionName: "allowance" as const,
        args: [getAddress(ownerAddr!), getAddress(v.address)],
      }));

      try {
        const results = await abortable(
          publicClient!.multicall({ contracts: calls }),
          signal
        );

        return sv.map((v, i) => {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");

          const r = results[i];
          const current = r.status === "success" ? r.result : null;

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

  const allowanceByKey = useMemo(() => {
    const map = new Map<`${Address}:${Address}`, VaultAllowance>();
    allowances?.forEach(a => {
      map.set(
        `${getAddress(a.vault.assetAddress)}:${getAddress(a.vault.address)}` as const,
        a
      );
    });
    return map;
  }, [allowances]);

  const approveOne = useCallback(
    async (v: SelectedVault, opts?: { mode?: ApprovalPolicy }) => {
      if (!ownerAddr) throw new Error("WALLET_REQUIRED");

      const key = `${v.assetAddress}:${v.address}` as const;
      const needsLegacyAllowance = v.legacyAllowance;
      const current = allowanceByKey.get(key)?.current ?? null;
      const needsToResetAllowance = needsLegacyAllowance && !!current && current > 0n;

      if (current !== null) {
        const needed = opts?.mode === "infinite" ? maxUint256 : v.amount;
        if (current >= needed) {
          return;
        }
      }

      if (isMounted.current) {
        setError(null);
        setPending(
          produce(draft => {
            draft[key] = true;
          })
        );
      }

      try {
        const amount = opts?.mode === "infinite" ? maxUint256 : v.amount;
        const tokenAddr = getAddress(v.assetAddress);
        const spender = getAddress(v.address);
        const owner = getAddress(ownerAddr);

        try {
          await publicClient!.simulateContract({
            abi: erc20Abi,
            address: tokenAddr,
            functionName: "approve",
            args: [spender, amount],
            account: owner,
          });
        } catch {
          throw new Error("SIMULATION_REVERTED");
        }

        if (needsToResetAllowance) {
          const hash0 = await writeContractAsync({
            abi: erc20Abi,
            address: v.assetAddress,
            functionName: "approve",
            args: [v.address, 0n],
          });

          await publicClient!.waitForTransactionReceipt({ hash: hash0 });
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
        if (isMounted.current) {
          setPending(
            produce(draft => {
              delete draft[key];
            })
          );
        }
      }
    },
    [
      ownerAddr,
      publicClient,
      writeContractAsync,
      refetch,
      isMounted,
      allowanceByKey,
    ]
  );

  const approveMissing = useCallback(
    async (opts: { mode?: ApprovalPolicy } = {}) => {
      if (!allowances || allowances.length === 0) throw new Error("NO_ALLOWANCES");

      const targets = allowances.filter(x => x.status !== "ok").map(x => x.vault);

      for (const v of targets) {
        await approveOne(v, opts);
      }
    },
    [allowances, approveOne]
  );

  const ableToRequest =
    sv.length > 0 && !!allowances && !allowances.some(a => a.status === "unknown");
  const allAllowed = allowances !== undefined && allowances.every(a => a.status === "ok");

  return {
    pendingApprovals: pending,
    approveMissing,
    error,
    allowances,
    allAllowed,
    ableToRequest,
    isPendingAllowances: isPending,
    isPendingApprovals: Object.values(pending).some(v => v),
    enabled,
  };
}
