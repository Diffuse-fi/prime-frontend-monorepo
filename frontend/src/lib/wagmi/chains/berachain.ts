import { berachain as beraDefault, Chain } from "wagmi/chains";

export const berachain = {
  ...beraDefault,
} as const satisfies Chain;
