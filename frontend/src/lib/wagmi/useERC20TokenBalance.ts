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
            address: token,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
            chainId,
          },
          {
            address: token,
            abi: erc20Abi,
            functionName: "decimals",
            chainId,
          },
          {
            address: token,
            abi: erc20Abi,
            functionName: "symbol",
            chainId,
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
