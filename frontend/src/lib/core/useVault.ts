import { QV } from "../query/versions";
import { opt, qk } from "../query/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VaultFullInfo, VaultWithAddress } from "./types";
import { useTokensMeta } from "../tokens/useTokensMeta";
import { useMemo } from "react";
import { populateTokenListWithMeta } from "../tokens/tokensMeta";

type UseVaultProps = {
  vault: VaultWithAddress;
};

const ROOT = "vault" as const;
const version = QV.vault;
const vaultKeys = {
  strategies: (address: string | null) => qk([ROOT, version, opt(address), "strategies"]),
  assets: (address: string | null) => qk([ROOT, version, opt(address), "assets"]),
};

export function useVault({ vault }: UseVaultProps) {
  const qc = useQueryClient();
  const addressKey = vault.address.toLowerCase();
  const chainId = vault.vault.init.chainId;
  const { meta } = useTokensMeta(chainId);

  const strategies = useQuery({
    enabled: !!vault,
    queryKey: vaultKeys.strategies(addressKey),
    queryFn: async () => {
      return vault.vault.getStrategies().then(strategies =>
        strategies.map(s => ({
          apr: s.apr,
          endDate: s.endDate,
          tokenAllocation: s.tokenAllocation,
        }))
      );
    },
    staleTime: 30_000,
  });

  const rawAssets = useQuery({
    enabled: !!vault,
    queryKey: vaultKeys.assets(addressKey),
    queryFn: () =>
      vault.vault.getAssets().then(assets =>
        assets.map(({ asset, symbol, decimals }) => ({
          chainId,
          address: asset,
          symbol,
          name: symbol,
          decimals,
        }))
      ),
    staleTime: 30_000,
  });

  const assets = useMemo(() => {
    if (!rawAssets.data || !meta) return [];

    return populateTokenListWithMeta({
      list: rawAssets.data,
      meta,
    });
  }, [rawAssets.data, meta]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: vaultKeys.strategies(addressKey) });
    qc.invalidateQueries({ queryKey: vaultKeys.assets(addressKey) });
  };

  const vaultFull = useMemo(() => {
    if (!strategies.data || !assets) return null;

    return {
      ...vault,
      strategies: strategies.data,
      assets,
    } satisfies VaultFullInfo;
  }, [vault, strategies.data, assets]);

  return {
    vaultFull,
    invalidate,
    isLoading: strategies.isLoading || rawAssets.isLoading,
    isError: strategies.isError || rawAssets.isError,
  };
}
