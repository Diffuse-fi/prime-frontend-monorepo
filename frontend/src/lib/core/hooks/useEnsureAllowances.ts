import { WalletRequiredError } from "@diffuse/sdk-js";
import { useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { raceSignal as abortable } from "race-signal";
import { useCallback, useMemo, useState } from "react";
import useIsMountedRef from "use-is-mounted-ref";
import { type Address, erc20Abi, getAddress, maxUint256 } from "viem";
import { useWriteContract } from "wagmi";

import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { SelectedVault } from "../types";

export type AllowanceStatus = "insufficient" | "missing" | "ok" | "unknown";
export type ApprovalPolicy = "exact" | "infinite";

export type EnsureAllowancesOptions = {
  onSuccess?: () => void;
};

export type EnsureAllowancesResult = {
  ableToRequest: boolean;
  allAllowed: boolean;
  allowances: undefined | VaultAllowance[];
  approveMissing: (opts?: { mode?: ApprovalPolicy }) => Promise<void>;
  error: Error | null;
  isPendingAllowances: boolean;
  isPendingApprovals: boolean;
  pendingApprovals: Pending;
  refetchAllowances: () => Promise<void>;
};
export type VaultAllowance = {
  current: bigint | null;
  status: AllowanceStatus;
  vault: SelectedVault;
};

type AddressPair = `${Address}:${Address}`;

type Pending = Record<AddressPair, boolean>;

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

export function useEnsureAllowances(
  sv: SelectedVault[],
  { onSuccess }: EnsureAllowancesOptions = {}
): EnsureAllowancesResult {
  const [pending, setPending] = useState<Pending>({});
  const [error, setError] = useState<Error | null>(null);
  const { address: ownerAddr, chainId, publicClient } = useClients();
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
    return [...set.values()];
  }, [sv]);

  const pairsKey = useMemo(
    () =>
      pairs.length > 0 ? pairs.map(p => `${p.asset}-${p.spender}`).join("|") : undefined,
    [pairs]
  );

  const {
    data: rawAllowances,
    isPending,
    refetch,
  } = useQuery({
    enabled,
    gcTime: 1000 * 60 * 10,
    queryFn: async ({ signal }): Promise<Map<AddressPair, bigint | null>> => {
      const calls = pairs.map(p => ({
        abi: erc20Abi,
        address: p.asset,
        args: [getAddress(ownerAddr!), p.spender],
        functionName: "allowance" as const,
      }));

      try {
        const results = await abortable(
          publicClient!.multicall({ contracts: calls }),
          signal
        );
        const map = new Map<AddressPair, bigint | null>();

        for (const [i, r] of results.entries()) {
          const key = pairKey(pairs[i].asset, pairs[i].spender);
          map.set(key, r.status === "success" ? (r.result as bigint) : null);
        }

        return map;
      } catch {
        const map = new Map<AddressPair, bigint | null>();

        for (const p of pairs) {
          try {
            const current = await abortable(
              publicClient!.readContract({
                abi: erc20Abi,
                address: p.asset,
                args: [getAddress(ownerAddr!), p.spender],
                functionName: "allowance",
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
    queryKey: qKeys.allowances(chainId, ownerAddr, pairsKey),
  });

  const allowances: undefined | VaultAllowance[] = useMemo(() => {
    if (!rawAllowances) return;

    return sv.map(v => {
      const key = pairKey(getAddress(v.assetAddress), getAddress(v.address));
      const current = rawAllowances.get(key) ?? null;

      const status: AllowanceStatus =
        current == undefined
          ? "unknown"
          : current >= v.amount
            ? "ok"
            : current === 0n
              ? "missing"
              : "insufficient";

      return { current, status, vault: v };
    });
  }, [sv, rawAllowances]);

  const allowanceByKey = useMemo(() => {
    const map = new Map<AddressPair, VaultAllowance>();
    if (allowances)
      for (const allowance of allowances) {
        map.set(
          `${getAddress(allowance.vault.assetAddress)}:${getAddress(allowance.vault.address)}` as const,
          allowance
        );
      }
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
        const assetAddr = getAddress(v.assetAddress);
        const spender = getAddress(v.address);
        const owner = getAddress(ownerAddr);

        try {
          await publicClient!.simulateContract({
            abi: erc20Abi,
            account: owner,
            address: assetAddr,
            args: [spender, amount],
            functionName: "approve",
          });
        } catch {
          throw new Error("SIMULATION_REVERTED");
        }

        if (needsToResetAllowance) {
          const hash0 = await writeContractAsync({
            abi: erc20Abi,
            address: v.assetAddress,
            args: [v.address, 0n],
            chainId,
            functionName: "approve",
          });

          await publicClient!.waitForTransactionReceipt({ hash: hash0 });
        }

        const hash = await writeContractAsync({
          abi: erc20Abi,
          address: v.assetAddress,
          args: [v.address, amount],
          chainId,
          functionName: "approve",
        });

        await publicClient!.waitForTransactionReceipt({ hash });

        await refetch();
        onSuccess?.();
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
      onSuccess,
      chainId,
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
    ableToRequest,
    allAllowed,
    allowances,
    approveMissing,
    error,
    isPendingAllowances: isPending,
    isPendingApprovals: Object.values(pending).some(Boolean),
    pendingApprovals: pending,
    refetchAllowances: async () => {
      await refetch();
    },
  };
}

function pairKey(asset: Address, spender: Address) {
  return `${asset}:${spender}` as const;
}
