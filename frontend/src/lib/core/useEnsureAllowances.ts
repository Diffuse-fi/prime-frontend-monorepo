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
import { WalletRequiredError } from "@diffuse/sdk-js";

export type ApprovalPolicy = "exact" | "infinite";
export type AllowanceStatus = "ok" | "missing" | "insufficient" | "unknown";

export type VaultAllowance = {
  vault: SelectedVault;
  current: bigint | null;
  status: AllowanceStatus;
};

type AddressPair = `${Address}:${Address}`;
type Pending = Record<AddressPair, boolean>;

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
    owner: Address | undefined,
    pairKey: string | undefined
  ) =>
    qk([
      QV.allowance,
      ROOT,
      opt(chainId),
      opt(owner),
      opt(pairKey),
    ]),
};

function pairKey(asset: Address, spender: Address) {
  return `${asset}:${spender}` as const;
}

export function useEnsureAllowances(sv: SelectedVault[]): EnsureAllowancesResult {
  const [pending, setPending] = useState<Pending>({});
  const [error, setError] = useState<Error | null>(null);
  const { address: ownerAddr, publicClient, chainId } = useClients();
  const isMounted = useIsMountedRef();
  const { writeContractAsync } = useWriteContract();
  const vaultsConsistency = sv.every(v => v.chainId === chainId);
  const enabled = sv?.length > 0 && !!ownerAddr && !!publicClient && vaultsConsistency;

  const pairs = useMemo(() => {
    const set = new Map<AddressPair, { asset: Address; spender: Address }>();
    for (const v of sv) {
      const asset = getAddress(v.assetAddress);
      const spender = getAddress(v.address);

      set.set(pairKey(asset, spender), { asset, spender });
    }
    return Array.from(set.values());
  }, [sv]);

  const pairsKey = useMemo(
    () =>
      pairs.length ? pairs.map(p => `${p.asset}-${p.spender}`).join("|") : undefined,
    [pairs]
  );

  const {
    data: rawAllowances,
    refetch,
    isPending,
  } = useQuery({
    queryKey: qKeys.allowances(chainId, ownerAddr, pairsKey),
    enabled,
    refetchOnWindowFocus: false,
    gcTime: 1000 * 60 * 10,
    queryFn: async ({ signal }): Promise<Map<AddressPair, bigint | null>> => {
      const calls = pairs.map(p => ({
        abi: erc20Abi,
        address: p.asset,
        functionName: "allowance" as const,
        args: [getAddress(ownerAddr!), p.spender],
      }));

      try {
        const results = await abortable(
          publicClient!.multicall({ contracts: calls }),
          signal
        );
        const map = new Map<AddressPair, bigint | null>();

        results.forEach((r, i) => {
          const key = pairKey(pairs[i].asset, pairs[i].spender);
          map.set(key, r.status === "success" ? (r.result as bigint) : null);
        });

        return map;
      } catch {
        const map = new Map<AddressPair, bigint | null>();

        for (const p of pairs) {
          try {
            const current = await abortable(
              publicClient!.readContract({
                abi: erc20Abi,
                address: p.asset,
                functionName: "allowance",
                args: [getAddress(ownerAddr!), p.spender],
              }),
              signal
            );
            map.set(pairKey(p.asset, p.spender), current);
          } catch {
            map.set(pairKey(p.asset, p.spender), null);
          }
        }
        return map;
      }
    },
  });

  const allowances: VaultAllowance[] | undefined = useMemo(() => {
    if (!rawAllowances) return undefined;

    return sv.map(v => {
      const key = pairKey(getAddress(v.assetAddress), getAddress(v.address));
      const current = rawAllowances.get(key) ?? null;

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
  }, [sv, rawAllowances]);

  const allowanceByKey = useMemo(() => {
    const map = new Map<AddressPair, VaultAllowance>();
    allowances?.forEach(allowance => {
      map.set(
        `${getAddress(allowance.vault.assetAddress)}:${getAddress(allowance.vault.address)}` as const,
        allowance
      );
    });
    return map;
  }, [allowances]);

  const approveOne = useCallback(
    async (v: SelectedVault, opts?: { mode?: ApprovalPolicy }) => {
      if (!ownerAddr) throw new WalletRequiredError();

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
