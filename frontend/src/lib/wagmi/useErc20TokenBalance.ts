import { Address, erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { useReadonlyChain } from "../chains/useReadonlyChain";

export function useERC20TokenBalance({ token }: { token?: Address }) {
  const { address } = useAccount();
  const enabled = !!address && !!token;
  const { chainId } = useReadonlyChain();

  const { data } = useReadContracts({
    allowFailure: false,
    contracts: enabled
      ? [
          {
            abi: erc20Abi,
            address: token,
            args: [address],
            chainId,
            functionName: "balanceOf",
          },
          {
            abi: erc20Abi,
            address: token,
            chainId,
            functionName: "decimals",
          },
          {
            abi: erc20Abi,
            address: token,
            chainId,
            functionName: "symbol",
          },
        ]
      : [],
    query: { enabled },
  });

  const [balance, decimals, symbol] = (data ?? []) as [
    bigint | undefined,
    number | undefined,
    string | undefined,
  ];

  return {
    balance,
    decimals,
    symbol,
  };
}
