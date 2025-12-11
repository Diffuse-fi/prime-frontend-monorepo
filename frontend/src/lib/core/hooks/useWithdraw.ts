import type { TxInfo, TxState, VaultFullInfo, VaultLimits } from "../types";

import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useMemo, useState } from "react";
import { type Address, getAddress, type Hash } from "viem";

import { formatUnits } from "../../formatters/asset";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { useClients } from "../../wagmi/useClients";
import { isUserRejectedError } from "../utils/errors";
import { lendLogger, loggerMut } from "../utils/loggers";

export type UseWithdrawParams = {
  onWithdrawError?: (errorMessage: string, address: Address) => void;
  onWithdrawSuccess?: (vaultAddress: Address, hash: Hash) => void;
};

export type UseWithdrawResult = {
  allConfirmed: boolean;

  isPending: boolean;
  reset: () => void;
  someAwaitingSignature: boolean;
  someError: boolean;
  txState: TxState;
  withdraw: (params: {
    amount: bigint;
    ownerOverride?: Address;
    receiverOverride?: Address;
    vaultAddress: Address;
  }) => Promise<Hash | null>;
};

const ROOT = "withdraw" as const;
const version = QV.withdraw;
const qKeys = {
  mutation: (chainId: number, vault: Address | null, wallet?: Address | null) =>
    qk([
      ROOT,
      "mutation",
      version,
      opt(chainId),
      opt(vault),
      opt(wallet),
    ]),
};

export function useWithdraw(
  allVaults: VaultFullInfo[],
  vaultsLimits: VaultLimits[],
  { onWithdrawError, onWithdrawSuccess }: UseWithdrawParams = {}
): UseWithdrawResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { address: wallet, chainId, publicClient } = useClients();

  const vaultByAddr = useMemo(() => {
    const m = new Map<Address, VaultFullInfo>();
    for (const v of allVaults) m.set(getAddress(v.address), v);
    return m;
  }, [allVaults]);

  const setPhase = (addr: Address, info: Partial<TxInfo>) =>
    setTxState(
      produce(prev => {
        prev[addr] = { ...(prev[addr] as TxInfo | undefined), ...info } as TxInfo;
      })
    );

  const setKeyPending = (key: string) =>
    setPendingByKey(
      produce(prev => {
        prev[key] = true;
      })
    );
  const clearKeyPending = (key: string) =>
    setPendingByKey(
      produce(prev => {
        delete prev[key];
      })
    );
  const isKeyPending = (key: string) => Boolean(pendingByKey[key]);

  const mutation = useMutation({
    mutationFn: async (params: {
      amount: bigint;
      ownerOverride?: Address;
      receiverOverride?: Address;
      vaultAddress: Address;
    }) => {
      if (!wallet || !publicClient || !chainId) return null;

      const address = getAddress(params.vaultAddress);
      const vault = vaultByAddr.get(address);
      const owner = getAddress(params.ownerOverride ?? wallet);
      const receiver = getAddress(params.receiverOverride ?? wallet);
      const assets = params.amount;

      const idemKey = makeIdemKey(chainId, address, assets, owner, receiver);
      const currentPhase = (txState[address]?.phase ?? "idle") as TxInfo["phase"];
      const isActive =
        currentPhase === "awaiting-signature" ||
        currentPhase === "pending" ||
        currentPhase === "replaced";

      if (isActive || isKeyPending(idemKey)) return null;

      let e: Error | null = null;
      if (!vault) e = new Error("Vault not found");
      if (assets <= 0n) e = new Error("Amount must be greater than zero");
      const maxWithdraw = vaultsLimits.find(v => v.address === address)?.maxWithdraw;
      if (maxWithdraw !== undefined && assets > maxWithdraw) {
        e = new Error(
          `Amount exceeds max withdraw limit of ${
            formatUnits(maxWithdraw, vault!.assets[0].decimals).text
          } ${vault!.assets[0].symbol}`
        );
      }
      if (e) {
        setPhase(address, { errorMessage: e.message, phase: "error" });
        onWithdrawError?.(e.message, address);
        lendLogger.error("withdraw failed: validation error", {
          amount: assets.toString(),
          error: e.message,
          owner,
          receiver,
          vault: address,
        });
        return null;
      }

      try {
        setKeyPending(idemKey);
        setPhase(address, { phase: "awaiting-signature" });

        const hash = await vault!.contract.withdraw([assets, receiver, owner]);

        setPhase(address, { hash, phase: "pending" });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(address, { hash: r.transaction.hash, phase: "replaced" });
          },
        });

        if (receipt.status === "success") {
          setPhase(address, { hash: receipt.transactionHash, phase: "success" });
          onWithdrawSuccess?.(address, receipt.transactionHash);
          return receipt.transactionHash;
        } else {
          const err = new Error("Transaction reverted");
          setPhase(address, { errorMessage: err.message, phase: "error" });
          onWithdrawError?.(err.message, address);
          lendLogger.error("withdraw failed: transaction reverted", {
            hash,
            vault: address,
          });
          return null;
        }
      } catch (error) {
        if (isUserRejectedError(error)) {
          setPhase(address, { phase: "idle" });
          lendLogger.info("withdraw cancelled by user", { address });
          return null;
        }

        const err = error instanceof Error ? error : new Error("Unknown error");
        setPhase(address, { errorMessage: err.message, phase: "error" });
        onWithdrawError?.(err.message, address);
        loggerMut.error("mutation error (withdraw)", {
          address,
          error: err,
          mutationKey: qKeys.mutation(chainId, address, wallet),
        });

        return null;
      } finally {
        clearKeyPending(idemKey);
      }
    },
    mutationKey: qKeys.mutation(chainId, null, wallet ?? null),
  });

  const withdraw = mutation.mutateAsync;

  const allConfirmed =
    Object.keys(txState).length > 0 &&
    Object.values(txState).every(s => s.phase === "success");
  const someError = Object.values(txState).some(s => s.phase === "error");
  const someAwaitingSignature = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );

  const reset = () => {
    setTxState({});
    setPendingByKey({});
    mutation.reset();
  };

  return {
    allConfirmed,
    isPending: mutation.isPending,
    reset,
    someAwaitingSignature,
    someError,
    txState,
    withdraw,
  };
}

function makeIdemKey(
  chainId: number,
  vault: Address,
  amount: bigint,
  owner: Address,
  receiver: Address
) {
  return `${chainId}:${vault.toLowerCase()}:${amount.toString()}:${owner.toLowerCase()}:${receiver.toLowerCase()}`;
}
