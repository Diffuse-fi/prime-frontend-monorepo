import { CHAINS } from "@diffuse/config";

type ChainMeta = {
  iconUrl?: string;
  iconBackground?: string;
};

export const chainLogos: Record<number, ChainMeta> = CHAINS.reduce(
  (acc, chain) => {
    acc[chain.id] = {
      iconUrl: chain.iconUrl,
      iconBackground: chain.iconBackground,
    };
    return acc;
  },
  {} as Record<number, ChainMeta>
);

export function getStableChainMeta(chainId: number) {
  return (
    chainLogos[chainId] ?? {
      iconUrl: undefined,
      iconBackground: undefined,
    }
  );
}
