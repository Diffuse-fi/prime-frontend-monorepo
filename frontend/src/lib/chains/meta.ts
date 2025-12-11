import { CHAINS } from "@diffuse/config";

type ChainMeta = {
  iconBackground?: string;
  iconUrl?: string;
};

export const chainLogos: Record<number, ChainMeta> = CHAINS.reduce(
  (acc, chain) => {
    acc[chain.id] = {
      iconBackground: chain.iconBackground,
      iconUrl: chain.iconUrl,
    };
    return acc;
  },
  {} as Record<number, ChainMeta>
);

export function getStableChainMeta(chainId: number) {
  return (
    chainLogos[chainId] ?? {
      iconBackground: undefined,
      iconUrl: undefined,
    }
  );
}
