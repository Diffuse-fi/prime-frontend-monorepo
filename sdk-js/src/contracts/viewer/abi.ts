import { Abi } from "viem";

export const viewerAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "adapterCheck",
    inputs: [
      { name: "adapterIn", type: "address", internalType: "contract IAdapter" },
      { name: "adapterOut", type: "address", internalType: "contract IAdapter" },
      { name: "sender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "delegatecall_",
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
          { name: "isDisabled", type: "bool", internalType: "bool" },
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
          {
            name: "feeData",
            type: "tuple",
            internalType: "struct IViewer.FeeViewData",
            components: [
              { name: "spreadFee", type: "uint16", internalType: "uint16" },
              { name: "earlyWithdrawalFee", type: "uint16", internalType: "uint16" },
              { name: "liquidationFee", type: "uint16", internalType: "uint16" },
            ],
          },
          {
            name: "pauseData",
            type: "tuple",
            internalType: "struct TypeLib.PauseData",
            components: [
              { name: "paused", type: "bool", internalType: "bool" },
              { name: "pauseReason", type: "string", internalType: "string" },
              { name: "pauseTimestamp", type: "uint40", internalType: "uint40" },
            ],
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
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
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
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "vaultRegistry",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IVaultRegistry" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "previousOwner", type: "address", indexed: true, internalType: "address" },
      { name: "newOwner", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyInitialized", inputs: [] },
  { type: "error", name: "EmptyRoute", inputs: [] },
  { type: "error", name: "InvalidAmountIn", inputs: [] },
  { type: "error", name: "InvalidAmountOut", inputs: [] },
  { type: "error", name: "InvalidDepositAmount", inputs: [] },
  {
    type: "error",
    name: "InvalidFinalTokenOutBalance",
    inputs: [
      { name: "tokenOutBalanceAfter", type: "uint256", internalType: "uint256" },
      { name: "tokenOutBalanceBefore", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "InvalidLastToken", inputs: [] },
  { type: "error", name: "InvalidRoute", inputs: [] },
  { type: "error", name: "InvalidTokenIn", inputs: [] },
  { type: "error", name: "InvalidVaultRegistry", inputs: [] },
  { type: "error", name: "OnlyCallsAllowed", inputs: [] },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "VaultNotFound",
    inputs: [{ name: "vault", type: "address", internalType: "address" }],
  },
] as const satisfies Abi;
