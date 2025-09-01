"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import type { Address, Hex } from "viem";
import { useClients } from "../wagmi/useClients";
import { useVaultContract } from "./contracts/useVaultContract";
import { defaultRetry } from "../query/defaults";
import { WalletRequiredError } from "@diffuse/sdk-js";
import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";

type ProgressPhase = "simulate" | "sign" | "broadcast" | "confirm";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProgressCb = (p: ProgressPhase, data?: any) => void;

type UseLendingParams = {
  vaultAddressOverride?: Address;
};

const ROOT = "lending" as const;
const version = QV.lending;

const vaultKeys = {
  root: (vault: Address | null) => qk(ROOT, version, opt(vault)),

  liquidity: (vault: Address | null) => qk(ROOT, version, opt(vault), "liquidity"),
  totalAssets: (vault: Address | null) => qk(ROOT, version, opt(vault), "totalAssets"),
  balanceOf: (vault: Address | null, user: Address | null) =>
    qk(ROOT, version, opt(vault), "balanceOf", opt(user)),
  positions: (vault: Address | null, user: Address | null) =>
    qk(ROOT, version, opt(vault), "positions", opt(user)),

  deposit: (vault: Address | null, user: Address | null) =>
    qk(ROOT, version, opt(vault), "deposit", opt(user)),
  withdraw: (vault: Address | null, user: Address | null) =>
    qk(ROOT, version, opt(vault), "withdraw", opt(user)),
  redeem: (vault: Address | null, user: Address | null) =>
    qk(ROOT, version, opt(vault), "redeem", opt(user)),
};

export function useLend({ vaultAddressOverride }: UseLendingParams = {}) {
  const { address: account } = useAccount();
  const { publicClient } = useClients();
  const qc = useQueryClient();
  const vault = useVaultContract(vaultAddressOverride);

  const availableLiquidity = useQuery({
    enabled: !!vault,
    queryKey: vaultKeys.liquidity(vaultAddressOverride ?? null),
    queryFn: () => vault!.availableLiquidity(),
    staleTime: 30_000,
    select: v => v,
  });

  const totalAssets = useQuery({
    enabled: !!vault,
    queryKey: vaultKeys.totalAssets(vaultAddressOverride ?? null),
    queryFn: () => vault!.totalAssets(),
    staleTime: 30_000,
  });

  const balance = useQuery({
    enabled: !!vault && !!account,
    queryKey: vaultKeys.balanceOf(vaultAddressOverride ?? null, account ?? null),
    queryFn: () => vault!.balanceOf(account!),
  });

  const waitFor = (hash: Hex) => publicClient!.waitForTransactionReceipt({ hash });

  const onWriteSuccess = () => {
    qc.invalidateQueries({ queryKey: vaultKeys.root(vaultAddressOverride ?? null) });
    qc.invalidateQueries({ queryKey: vaultKeys.liquidity(vaultAddressOverride ?? null) });
    qc.invalidateQueries({
      queryKey: vaultKeys.totalAssets(vaultAddressOverride ?? null),
    });
    if (account) {
      qc.invalidateQueries({
        queryKey: vaultKeys.balanceOf(vaultAddressOverride ?? null, account),
      });
      qc.invalidateQueries({
        queryKey: vaultKeys.positions(vaultAddressOverride ?? null, account),
      });
    }
  };

  const deposit = useMutation({
    mutationKey: [
      "deposit",
      vaultKeys.deposit(vaultAddressOverride ?? null, account ?? null),
    ],
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
    mutationKey: [
      "withdraw",
      vaultKeys.withdraw(vaultAddressOverride ?? null, account ?? null),
    ],
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
    mutationKey: [
      "redeem",
      vaultKeys.redeem(vaultAddressOverride ?? null, account ?? null),
    ],
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

  return {
    vault,
    availableLiquidity,
    totalAssets,
    balance,
    deposit,
    withdraw,
    redeem,
  };
}
