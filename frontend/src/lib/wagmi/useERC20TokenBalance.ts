import { Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

export function useERC20TokenBalance({
  address,
  token,
}: {
  address?: Address;
  token?: Address;
}) {
  const enabled = !!address && !!token;

  const { data } = useReadContracts({
    allowFailure: false,
    contracts: enabled
      ? [
          {
            address: token,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          },
          {
            address: token,
            abi: erc20Abi,
            functionName: "decimals",
          },
          {
            address: token,
            abi: erc20Abi,
            functionName: "symbol",
          },
        ]
      : [],
    query: { enabled },
  });

  return {
    balance: (data?.[0] as bigint | undefined) ?? undefined,
    decimals: (data?.[1] as number | undefined) ?? undefined,
    symbol: (data?.[2] as string | undefined) ?? undefined,
  };
}
