import { Address, getAddress, type Hex } from "viem";
import { useReadContracts } from "wagmi";

import { useReadonlyChain } from "@/lib/chains/useReadonlyChain";

type UseStrategySyExchangeRateArgs = {
  strategyAssetAddress?: Address | Hex;
};

export function useStrategySyExchangeRate({
  strategyAssetAddress,
}: UseStrategySyExchangeRateArgs) {
  const { chainId } = useReadonlyChain();
  const normalizedStrategyAssetAddress = strategyAssetAddress
    ? getAddress(strategyAssetAddress)
    : undefined;

  const { data: syTokenData } = useReadContracts({
    allowFailure: false,
    contracts: normalizedStrategyAssetAddress
      ? [
          {
            abi: [
              {
                inputs: [],
                name: "SY",
                outputs: [{ type: "address" }],
                stateMutability: "view",
                type: "function",
              },
            ],
            address: normalizedStrategyAssetAddress,
            chainId,
            functionName: "SY",
          },
        ]
      : [],
    query: { enabled: !!normalizedStrategyAssetAddress },
  });

  const [syTokenAddress] = (syTokenData ?? []) as [Address | undefined];

  const { data: exchangeRateData } = useReadContracts({
    allowFailure: false,
    contracts: syTokenAddress
      ? [
          {
            abi: [
              {
                inputs: [],
                name: "exchangeRate",
                outputs: [{ type: "uint256" }],
                stateMutability: "view",
                type: "function",
              },
            ],
            address: syTokenAddress,
            chainId,
            functionName: "exchangeRate",
          },
        ]
      : [],
    query: { enabled: !!syTokenAddress },
  });

  const [exchangeRate] = (exchangeRateData ?? []) as [bigint | undefined];

  return { exchangeRate };
}
