import { useMemo, useState } from "react";
import { getAddress, type Address, type Hash, formatUnits as formatUnitsViem } from "viem";
import { useClients } from "../../wagmi/useClients";
import type { TxInfo, TxState, VaultFullInfo, VaultLimits } from "../types";
import { useMutation } from "@tanstack/react-query";
import { opt, qk } from "../../query/helpers";
import { QV } from "../../query/versions";
import { produce } from "immer";
import { formatUnits } from "../../formatters/asset";
import { isUserRejectedError } from "../utils/errors";
import { lendLogger, loggerMut } from "../utils/loggers";
import {
  trackWithdrawAttempt,
  trackWithdrawSuccess,
  trackWithdrawError,
} from "../../analytics";

export type UseWithdrawParams = {
  onWithdrawSuccess?: (vaultAddress: Address, hash: Hash) => void;
  onWithdrawError?: (errorMessage: string, address: Address) => void;
};

export type UseWithdrawResult = {
  withdraw: (params: {
    vaultAddress: Address;
    amount: bigint;
    receiverOverride?: Address;
    ownerOverride?: Address;
  }) => Promise<Hash | null>;

  reset: () => void;
  txState: TxState;
  allConfirmed: boolean;
  someError: boolean;
  someAwaitingSignature: boolean;
  isPending: boolean;
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

function makeIdemKey(
  chainId: number,
  vault: Address,
  amount: bigint,
  owner: Address,
  receiver: Address
) {
  return `${chainId}:${vault.toLowerCase()}:${amount.toString()}:${owner.toLowerCase()}:${receiver.toLowerCase()}`;
}

export function useWithdraw(
  allVaults: VaultFullInfo[],
  vaultsLimits: VaultLimits[],
  { onWithdrawSuccess, onWithdrawError }: UseWithdrawParams = {}
): UseWithdrawResult {
  const [txState, setTxState] = useState<TxState>({});
  const [pendingByKey, setPendingByKey] = useState<Record<string, true>>({});
  const { chainId, address: wallet, publicClient } = useClients();

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
    mutationKey: qKeys.mutation(chainId, null, wallet ?? null),
    mutationFn: async (params: {
      vaultAddress: Address;
      amount: bigint;
      receiverOverride?: Address;
      ownerOverride?: Address;
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
        setPhase(address, { phase: "error", errorMessage: e.message });
        onWithdrawError?.(e.message, address);
        lendLogger.error("withdraw failed: validation error", {
          vault: address,
          amount: assets.toString(),
          receiver,
          owner,
          error: e.message,
        });
        return null;
      }

      try {
        setKeyPending(idemKey);
        setPhase(address, { phase: "awaiting-signature" });

        // Track withdraw attempt
        trackWithdrawAttempt({
          vaultAddress: address,
          chainId: chainId!,
          assetSymbol: vault!.assets[0].symbol,
          amount: formatUnitsViem(assets, vault!.assets[0].decimals),
        });

        const hash = await vault!.contract.withdraw([assets, receiver, owner]);

        setPhase(address, { phase: "pending", hash });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          onReplaced: r => {
            setPhase(address, { phase: "replaced", hash: r.transaction.hash });
          },
        });

        if (receipt.status === "success") {
          setPhase(address, { phase: "success", hash: receipt.transactionHash });

          // Track withdraw success
          trackWithdrawSuccess({
            vaultAddress: address,
            chainId: chainId!,
            assetSymbol: vault!.assets[0].symbol,
            amount: formatUnitsViem(assets, vault!.assets[0].decimals),
            txHash: receipt.transactionHash,
          });

          onWithdrawSuccess?.(address, receipt.transactionHash);
          return receipt.transactionHash;
        } else {
          const err = new Error("Transaction reverted");
          setPhase(address, { phase: "error", errorMessage: err.message });

          // Track withdraw error
          trackWithdrawError({
            vaultAddress: address,
            chainId: chainId!,
            assetSymbol: vault!.assets[0].symbol,
            amount: formatUnitsViem(assets, vault!.assets[0].decimals),
            errorMessage: err.message,
          });

          onWithdrawError?.(err.message, address);
          lendLogger.error("withdraw failed: transaction reverted", {
            vault: address,
            hash,
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
        setPhase(address, { phase: "error", errorMessage: err.message });

        // Track withdraw error
        trackWithdrawError({
          vaultAddress: address,
          chainId: chainId!,
          assetSymbol: vault!.assets[0].symbol,
          amount: formatUnitsViem(assets, vault!.assets[0].decimals),
          errorMessage: err.message,
        });

        onWithdrawError?.(err.message, address);
        loggerMut.error("mutation error (withdraw)", {
          mutationKey: qKeys.mutation(chainId, address, wallet),
          address,
          error: err,
        });

        return null;
      } finally {
        clearKeyPending(idemKey);
      }
    },
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
    withdraw,
    reset,
    txState,
    allConfirmed,
    someError,
    someAwaitingSignature,
    isPending: mutation.isPending,
  };
}
