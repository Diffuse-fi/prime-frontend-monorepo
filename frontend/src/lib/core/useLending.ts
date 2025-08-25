"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import type { Address, Hex } from "viem";
import { useClients } from "../wagmi/useClients";
import { useVaultContract } from "./useVaultContract";
import { defaultRetry } from "../query/defaults";
import { WalletRequiredError } from "@diffuse/sdk-js";

type ProgressPhase = "simulate" | "sign" | "broadcast" | "confirm";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProgressCb = (p: ProgressPhase, data?: any) => void;

export function useLending({
  vaultAddressOverride,
}: { vaultAddressOverride?: Address } = {}) {
  const { address: account } = useAccount();
  const { publicClient } = useClients();
  const qc = useQueryClient();

  const vault = useVaultContract(vaultAddressOverride);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vaultAddress = (vault as any)?.getContract?.().address as Address | undefined;

  const qk = {
    liquidity: ["vault", vaultAddress, "liquidity"] as const,
    borrowApr: ["vault", vaultAddress, "borrowApr"] as const,
    totalAssets: ["vault", vaultAddress, "totalAssets"] as const,
    balanceOf: (u?: Address) => ["vault", vaultAddress, "balanceOf", u] as const,
    positions: (u?: Address) => ["vault", vaultAddress, "positions", u] as const,
  };

  // Reads via SDK -> TanStack
  const availableLiquidity = useQuery({
    enabled: !!vault,
    queryKey: qk.liquidity,
    queryFn: () => vault!.availableLiquidity(),
    staleTime: 30_000,
    select: v => v, // place for formatting
  });

  const borrowAPR = useQuery({
    enabled: !!vault,
    queryKey: qk.borrowApr,
    queryFn: () => vault!.getBorrowAPR(),
    staleTime: 60_000,
  });

  const totalAssets = useQuery({
    enabled: !!vault,
    queryKey: qk.totalAssets,
    queryFn: () => vault!.totalAssets(),
    staleTime: 30_000,
  });

  const balance = useQuery({
    enabled: !!vault && !!account,
    queryKey: qk.balanceOf(account),
    queryFn: () => vault!.balanceOf(account!),
  });

  const borrowerPositions = useQuery({
    enabled: !!vault && !!account,
    queryKey: qk.positions(account),
    queryFn: () => vault!.getBorrowerPositions(account!),
  });

  const waitFor = (hash: Hex) => publicClient!.waitForTransactionReceipt({ hash });

  const onWriteSuccess = () => {
    qc.invalidateQueries({ queryKey: qk.liquidity });
    qc.invalidateQueries({ queryKey: qk.totalAssets });
    if (account) {
      qc.invalidateQueries({ queryKey: qk.balanceOf(account) });
      qc.invalidateQueries({ queryKey: qk.positions(account) });
    }
  };

  // Writes via SDK -> TanStack (SDK already simulates)
  const deposit = useMutation({
    mutationKey: ["deposit", vaultAddress, account],
    mutationFn: async (vars: {
      assets: bigint;
      receiver?: Address;
      onProgress?: ProgressCb;
    }) => {
      if (!vault) throw new Error("Vault not initialized");
      vars.onProgress?.("simulate");
      vars.onProgress?.("sign");
      const hash = await vault.deposit([vars.assets, (vars.receiver ?? account)!]);
      vars.onProgress?.("broadcast", { hash });
      const receipt = await waitFor(hash);
      vars.onProgress?.("confirm", { receipt });
      return { hash, receipt };
    },
    onSuccess: onWriteSuccess,
    retry: (count, e) => !(e instanceof WalletRequiredError) && count < 2,
  });

  const withdraw = useMutation({
    mutationKey: ["withdraw", vaultAddress, account],
    mutationFn: async (vars: {
      assets: bigint;
      receiver?: Address;
      owner?: Address;
      onProgress?: ProgressCb;
    }) => {
      if (!vault) throw new Error("Vault not initialized");
      vars.onProgress?.("simulate");
      vars.onProgress?.("sign");
      const hash = await vault.withdraw([
        vars.assets,
        (vars.receiver ?? account)!,
        (vars.owner ?? account)!,
      ]);
      vars.onProgress?.("broadcast", { hash });
      const receipt = await waitFor(hash);
      vars.onProgress?.("confirm", { receipt });
      return { hash, receipt };
    },
    onSuccess: onWriteSuccess,
    retry: (count, e) => !(e instanceof WalletRequiredError) && count < 2,
  });

  const redeem = useMutation({
    mutationKey: ["redeem", vaultAddress, account],
    mutationFn: async (vars: {
      shares: bigint;
      receiver?: Address;
      owner?: Address;
      onProgress?: ProgressCb;
    }) => {
      if (!vault) throw new Error("Vault not initialized");
      vars.onProgress?.("simulate");
      vars.onProgress?.("sign");
      const hash = await vault.redeem([
        vars.shares,
        (vars.receiver ?? account)!,
        (vars.owner ?? account)!,
      ]);
      vars.onProgress?.("broadcast", { hash });
      const receipt = await waitFor(hash);
      vars.onProgress?.("confirm", { receipt });
      return { hash, receipt };
    },
    onSuccess: onWriteSuccess,
    retry: defaultRetry,
  });

  const borrow = useMutation({
    mutationKey: ["borrow", vaultAddress, account],
    mutationFn: async (vars: {
      collateral: bigint;
      debt: bigint;
      maxLTV: bigint;
      rate: bigint;
      deadline: bigint;
      onProgress?: ProgressCb;
    }) => {
      if (!vault) throw new Error("Vault not initialized");
      vars.onProgress?.("simulate");
      vars.onProgress?.("sign");
      const hash = await vault.borrow([
        vars.collateral,
        vars.debt,
        vars.maxLTV,
        vars.rate,
        vars.deadline,
      ]);
      vars.onProgress?.("broadcast", { hash });
      const receipt = await waitFor(hash);
      vars.onProgress?.("confirm", { receipt });
      return { hash, receipt };
    },
    onSuccess: onWriteSuccess,
    retry: (count, e) => !(e instanceof WalletRequiredError) && count < 2,
  });

  const unborrow = useMutation({
    mutationKey: ["unborrow", vaultAddress, account],
    mutationFn: async (vars: {
      positionId: bigint;
      repayAmount: bigint;
      onProgress?: ProgressCb;
    }) => {
      if (!vault) throw new Error("Vault not initialized");
      vars.onProgress?.("simulate");
      vars.onProgress?.("sign");
      const hash = await vault.unborrow([vars.positionId, vars.repayAmount]);
      vars.onProgress?.("broadcast", { hash });
      const receipt = await waitFor(hash);
      vars.onProgress?.("confirm", { receipt });
      return { hash, receipt };
    },
    onSuccess: onWriteSuccess,
    retry: (count, e) => !(e instanceof WalletRequiredError) && count < 2,
  });

  return {
    vault,
    vaultAddress,
    availableLiquidity,
    borrowAPR,
    totalAssets,
    balance,
    borrowerPositions,
    deposit,
    withdraw,
    redeem,
    borrow,
    unborrow,
  };
}
