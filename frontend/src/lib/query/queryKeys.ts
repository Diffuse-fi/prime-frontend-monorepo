export const qk = {
  markets: (chainId: number) => ["markets", chainId] as const,
  userPosition: (chainId: number, account: `0x${string}`) =>
    ["userPosition", chainId, account] as const,
};
