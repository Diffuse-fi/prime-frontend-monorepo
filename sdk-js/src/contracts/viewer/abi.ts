import { Abi } from "viem";

export const viewerAbi = [
  {
    type: "function",
    name: "delegatecall",
    inputs: [
      { name: "target", type: "address", internalType: "address" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bool", internalType: "bool" },
      { name: "", type: "bytes", internalType: "bytes" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAssets",
    inputs: [{ name: "vault", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IViewer.TokenViewData[]",
        components: [
          { name: "asset", type: "address", internalType: "contract IERC20" },
          { name: "decimals", type: "uint8", internalType: "uint8" },
          { name: "symbol", type: "string", internalType: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategies",
    inputs: [{ name: "vault", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IViewer.StrategyViewData[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          {
            name: "token",
            type: "tuple",
            internalType: "struct IViewer.TokenViewData",
            components: [
              { name: "asset", type: "address", internalType: "contract IERC20" },
              { name: "decimals", type: "uint8", internalType: "uint8" },
              { name: "symbol", type: "string", internalType: "string" },
            ],
          },
          { name: "apr", type: "uint256", internalType: "uint256" },
          { name: "endDate", type: "uint256", internalType: "uint256" },
          { name: "balance", type: "uint256", internalType: "uint256" },
          { name: "pool", type: "address", internalType: "address" },
          { name: "name", type: "string", internalType: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaults",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IViewer.VaultViewData[]",
        components: [
          { name: "vault", type: "address", internalType: "address" },
          { name: "name", type: "string", internalType: "string" },
          { name: "targetApr", type: "uint256", internalType: "uint256" },
          { name: "riskLevel", type: "uint8", internalType: "uint8" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "init",
    inputs: [
      {
        name: "_vaultRegistry",
        type: "address",
        internalType: "contract IVaultRegistry",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "previewEnterStrategy",
    inputs: [
      { name: "vault", type: "address", internalType: "address" },
      { name: "strategyId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "baseAssetAmount", type: "uint256", internalType: "uint256" },
      { name: "strategyAssetAmount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "vaultRegistry",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IVaultRegistry" }],
    stateMutability: "view",
  },
] as const satisfies Abi;
