import { useMemo, useState } from "react";
import pLimit from "p-limit";
import { getAddress, type Address, type Hash } from "viem";
import { useClients } from "../wagmi/useClients";
import type { SelectedVault, TxInfo, TxState } from "./types";
import type { VaultFullInfo } from "./types";
import { useMutation } from "@tanstack/react-query";
import { opt, qk } from "../query/helpers";
import { QV } from "../query/versions";

export type UseLendParams = {
  txConcurrency?: number;
  onDepositBatchComplete?: (result: LendBatchResult) => void;
  onWithdrawBatchComplete?: (result: LendBatchResult) => void;
};

export type LendBatchResult = {
  hashes: Record<Address, Hash>;
  errors: Record<Address, Error>;
};

const ROOT = "deposit" as const;
const version = QV.deposit;
const qKeys = {
  deposit: (chainId: number, addresses: string | null) =>
    qk([ROOT, version, opt(chainId), opt(addresses), "deposit"]),
};

export function useDeposit(
  selected: SelectedVault[],
  allVaults: VaultFullInfo[],
  {
    txConcurrency = 1,
    onDepositBatchComplete,
    onWithdrawBatchComplete,
  }: UseLendParams = {}
) {
  const [txState, setTxState] = useState<TxState>({});
  const { chainId, address: wallet, publicClient } = useClients();
  const vaultsConsistency = selected.every(v => v.chainId === chainId);

  const vaultByAddr = useMemo(() => {
    const m = new Map<Address, VaultFullInfo>();
    for (const v of allVaults) m.set(getAddress(v.address), v);
    return m;
  }, [allVaults]);

  const limit = useMemo(() => pLimit(Math.max(1, txConcurrency)), [txConcurrency]);

  const runBatch = async (
    kind: "deposit" | "withdraw"
  ): Promise<{ hashes: Record<Address, Hash>; errors: Record<Address, Error> }> => {
    if (!publicClient || !wallet || !vaultsConsistency) throw new Error("NOT_READY");

    const addrMe = getAddress(wallet);
    const targets = selected.filter(v => v.amount && v.amount > 0n);

    setTxState(prev => {
      const next = { ...prev };
      for (const v of targets) next[getAddress(v.address)] = { phase: "submitting" };
      return next;
    });

    const hashes: Record<Address, Hash> = {};
    const errors: Record<Address, Error> = {};

    const setOne = (addr: Address, info: Partial<TxInfo>) =>
      setTxState(prev => ({
        ...prev,
        [addr]: { ...(prev[addr] ?? { phase: "idle" }), ...info },
      }));

    const tasks = targets.map(v =>
      limit(async () => {
        const addr = getAddress(v.address);
        const vf = vaultByAddr.get(addr);
        if (!vf) {
          const err = new Error("VAULT_CONTRACT_NOT_FOUND");
          errors[addr] = err;
          setOne(addr, { phase: "error", error: err });
          return;
        }

        try {
          setOne(addr, { phase: "submitting" });

          const txHash =
            kind === "deposit"
              ? ((await vf.contract.deposit([v.amount, addrMe])) as Hash)
              : ((await vf.contract.withdraw([v.amount, addrMe, addrMe])) as Hash);

          setOne(addr, { phase: "mining", hash: txHash });
          await publicClient.waitForTransactionReceipt({ hash: txHash });

          hashes[addr] = txHash;
          setOne(addr, { phase: "success", hash: txHash });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          const err = e instanceof Error ? e : new Error(String(e));
          errors[addr] = err;
          setOne(addr, { phase: "error", error: err });
        }
      })
    );

    return { hashes, errors };
  };

  const depositMutation = useMutation({
    mutationKey: qKeys.deposit(
      chainId,
      selected
        .map(v => v.address)
        .sort()
        .join("|")
    ),
    mutationFn: () => runBatch("deposit"),
  });

  const deposit = depositMutation.mutateAsync;

  const reset = () => {
    setTxState({});
    depositMutation.reset();
  };

  return { deposit, reset, txState };
}
