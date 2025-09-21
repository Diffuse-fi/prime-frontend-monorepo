import { chainLogos } from "./config";

export function getStableChainMeta(chainId: number) {
  return (
    chainLogos[chainId] ?? {
      iconUrl: undefined,
      iconBackground: undefined,
    }
  );
}
