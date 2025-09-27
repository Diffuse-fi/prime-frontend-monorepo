import { Abi } from "viem";

export const viewerAbi = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAssets",
    inputs: [
      {
        name: "vault",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IViewer.TokenViewData[]",
        components: [
          {
            name: "asset",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "decimals",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "symbol",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategies",
    inputs: [
      {
        name: "vault",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IViewer.StrategyViewData[]",
        components: [
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "token",
            type: "tuple",
            internalType: "struct IViewer.TokenViewData",
            components: [
              {
                name: "asset",
                type: "address",
                internalType: "contract IERC20",
              },
              {
                name: "decimals",
                type: "uint8",
                internalType: "uint8",
              },
              {
                name: "symbol",
                type: "string",
                internalType: "string",
              },
            ],
          },
          {
            name: "apr",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "endDate",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "balance",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "pool",
            type: "address",
            internalType: "address",
          },
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
          {
            name: "vault",
            type: "address",
            internalType: "address",
          },
          {
            name: "name",
            type: "string",
            internalType: "string",
          },
          {
            name: "targetApr",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "riskLevel",
            type: "uint8",
            internalType: "uint8",
          },
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
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "vaultRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IVaultRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AlreadyInitialized",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const satisfies Abi;
