import { Abi } from "viem";

export const vaultAbi = [
  {
    type: "function",
    name: "_liquidateSingle",
    inputs: [
      {
        name: "vaultAndPositionId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "minAssetsOut",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "accruedLenderYield",
    inputs: [
      {
        name: "strategyIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "lender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "totalYield",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxToWithdraw",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addBorrowerToWhitelist",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addLenderToWhitelist",
    inputs: [
      {
        name: "lender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addStrategy",
    inputs: [
      {
        name: "_strategy",
        type: "tuple",
        internalType: "struct TypeLib.StrategyData",
        components: [
          {
            name: "addr",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "strategyType",
            type: "uint8",
            internalType: "enum TypeLib.StrategyType",
          },
          {
            name: "isDisabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "endDate",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "borrowApr",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "balance",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "assets",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "name",
            type: "string",
            internalType: "string",
          },
          {
            name: "pool",
            type: "address",
            internalType: "address",
          },
          {
            name: "minLeverage",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "maxLeverage",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "immutableData",
            type: "bytes32[]",
            internalType: "bytes32[]",
          },
          {
            name: "route",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "reverseRoute",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "minStrategyAssetCollateralAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "asset",
    inputs: [],
    outputs: [
      {
        name: "assetTokenAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "availableLiquidity",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "borrowRequest",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "collateralType",
        type: "uint8",
        internalType: "enum TypeLib.CollateralType",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "assetsToBorrow",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "liquidationPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minAssetsOut",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeReverseRoute",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newReverseRoute",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeRoute",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newRoute",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "convertToAssets",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "convertToShares",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "disableStrategy",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fillBaseAssetDeficit",
    inputs: [
      {
        name: "deficitToFill",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getActiveBorrowerPositionIds",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getActiveBorrowerPositions",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct TypeLib.BorrowerPosition[]",
        components: [
          {
            name: "user",
            type: "address",
            internalType: "address",
          },
          {
            name: "collateralType",
            type: "uint8",
            internalType: "enum TypeLib.CollateralType",
          },
          {
            name: "subjectToLiquidation",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "strategyId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "assetsBorrowed",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "collateralGiven",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "leverage",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "minAssetsOut",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          {
            name: "strategyBalance",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "enterTimeOrDeadline",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "blockNumber",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "liquidationPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "cachedRoute",
            type: "address[]",
            internalType: "address[]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAttestationContract",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IAutomataDcapAttestationFee",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBaseAssetDeficit",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBorrowApr",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBorrowerPosition",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct TypeLib.BorrowerPosition",
        components: [
          {
            name: "user",
            type: "address",
            internalType: "address",
          },
          {
            name: "collateralType",
            type: "uint8",
            internalType: "enum TypeLib.CollateralType",
          },
          {
            name: "subjectToLiquidation",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "strategyId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "assetsBorrowed",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "collateralGiven",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "leverage",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "minAssetsOut",
            type: "uint256[]",
            internalType: "uint256[]",
          },
          {
            name: "strategyBalance",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "id",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "enterTimeOrDeadline",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "blockNumber",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "liquidationPrice",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "cachedRoute",
            type: "address[]",
            internalType: "address[]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurator",
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
    name: "getCuratorTimelock",
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
    name: "getEarlyWithdrawalFee",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEndDate",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFeeReceiver",
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
    name: "getFirstActualStrategyId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLiquidationFee",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLiquidationPriceDiff",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLiquidator",
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
    name: "getMinBaseAssetCollateralAmount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMrEnclaveExpected",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOracle",
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
    name: "getPauseStatus",
    inputs: [],
    outputs: [
      {
        name: "paused",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "timestamp",
        type: "uint40",
        internalType: "uint40",
      },
      {
        name: "reason",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPendingBorrowerPositionIds",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSpreadFee",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategy",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct TypeLib.StrategyData",
        components: [
          {
            name: "addr",
            type: "address",
            internalType: "contract IERC20",
          },
          {
            name: "strategyType",
            type: "uint8",
            internalType: "enum TypeLib.StrategyType",
          },
          {
            name: "isDisabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "endDate",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "borrowApr",
            type: "uint40",
            internalType: "uint40",
          },
          {
            name: "balance",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "assets",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "name",
            type: "string",
            internalType: "string",
          },
          {
            name: "pool",
            type: "address",
            internalType: "address",
          },
          {
            name: "minLeverage",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "maxLeverage",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "immutableData",
            type: "bytes32[]",
            internalType: "bytes32[]",
          },
          {
            name: "route",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "reverseRoute",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "minStrategyAssetCollateralAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategyLength",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStrategyOutstandingYield",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultRegistry",
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
    type: "function",
    name: "getWeightedApr",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWhitelistedBorrowers",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWhitelistedLenders",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isBorrowerWhitelisted",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isLenderWhitelistDisabled",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isLenderWhitelisted",
    inputs: [
      {
        name: "lender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "liquidate",
    inputs: [
      {
        name: "blocks",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "positionData",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "minAssetsOut",
        type: "uint256[][]",
        internalType: "uint256[][]",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "datas",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [
      {
        name: "assetsReceived",
        type: "uint256[][]",
        internalType: "uint256[][]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "liquidationRequest",
    inputs: [
      {
        name: "positions",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "maxDeposit",
    inputs: [
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "maxAssets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxMint",
    inputs: [
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "maxShares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxRedeem",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "maxShares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxWithdraw",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "maxAssets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pause",
    inputs: [
      {
        name: "reason",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "previewActivatePosition",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "assetsReceived",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "previewBorrow",
    inputs: [
      {
        name: "forUser",
        type: "address",
        internalType: "address",
      },
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "collateralType",
        type: "uint8",
        internalType: "enum TypeLib.CollateralType",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "assetsToBorrow",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "assetsReceived",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "previewDeposit",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewLiquidate",
    inputs: [
      {
        name: "vaults",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "positions",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "datas",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [
      {
        name: "liquidationCount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "assetsReceived",
        type: "uint256[][]",
        internalType: "uint256[][]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "previewLiquidateQuote",
    inputs: [
      {
        name: "vaults",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "positions",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "datas",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "previewMint",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewRedeem",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewWithdraw",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "redeem",
    inputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeBorrowRequest",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeBorrowerFromWhitelist",
    inputs: [
      {
        name: "borrower",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeLenderFromWhitelist",
    inputs: [
      {
        name: "lender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "reverseRoute",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "revokeLiquidationRequests",
    inputs: [
      {
        name: "positions",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "route",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setAttestationContract",
    inputs: [
      {
        name: "attestationContract",
        type: "address",
        internalType: "contract IAutomataDcapAttestationFee",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCurator",
    inputs: [
      {
        name: "curator",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCuratorTimelock",
    inputs: [
      {
        name: "curatorTimelock",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setEarlyWithdrawalFee",
    inputs: [
      {
        name: "earlyWithdrawalFee",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setFeeReceiver",
    inputs: [
      {
        name: "feeReceiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLenderWhitelistStatus",
    inputs: [
      {
        name: "_isLenderWhitelistDisabled",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLiquidationFee",
    inputs: [
      {
        name: "liquidationFee",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLiquidationPriceDiff",
    inputs: [
      {
        name: "liquidationPriceDiff",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLiquidator",
    inputs: [
      {
        name: "liquidator",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMinBaseAssetCollateralAmount",
    inputs: [
      {
        name: "minBaseAssetCollateralAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMrEnclaveExpected",
    inputs: [
      {
        name: "mrEnclaveExpected",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setOracle",
    inputs: [
      {
        name: "oracle",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setSpreadFee",
    inputs: [
      {
        name: "spreadFee",
        type: "uint16",
        internalType: "uint16",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sgxActivateBorrowerPosition",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "liquidationPrice",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "blocksAndHashes",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "assetsReceived",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "shadowStrategy",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newApr",
        type: "uint40",
        internalType: "uint40",
      },
      {
        name: "newName",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "strategyBalance",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAssets",
    inputs: [],
    outputs: [
      {
        name: "totalManagedAssets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalAssetsUtilized",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unborrow",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minAssetsOut",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "returned",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "borrowerGets",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "finished",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [
      {
        name: "reason",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "receiver",
        type: "address",
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "shares",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawYield",
    inputs: [
      {
        name: "strategyIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BaseAssetDeficitDecreased",
    inputs: [
      {
        name: "baseAssetDeficit",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "totalBaseAssetDeficit",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BaseAssetDeficitFilled",
    inputs: [
      {
        name: "baseAssetDeficit",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BaseAssetDeficitIncreased",
    inputs: [
      {
        name: "baseAssetDeficit",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "totalBaseAssetDeficit",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowRequest",
    inputs: [
      {
        name: "vault",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "strategyId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "positionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "strategyPool",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "collateralType",
        type: "uint8",
        indexed: false,
        internalType: "enum TypeLib.CollateralType",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "assetsToBorrow",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "proposedLiquidationPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "deadline",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowRequestRemoved",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "collateralToReturn",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerPositionActivated",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "strategyId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collateralType",
        type: "uint8",
        indexed: false,
        internalType: "enum TypeLib.CollateralType",
      },
      {
        name: "collateralGiven",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "borrowedAssets",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "strategyBalance",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "enterTimeOrDeadline",
        type: "uint40",
        indexed: false,
        internalType: "uint40",
      },
      {
        name: "blockNumber",
        type: "uint40",
        indexed: false,
        internalType: "uint40",
      },
      {
        name: "liquidationPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerPositionFinished",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerPositionNotSubjectToLiquidation",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerPositionSubjectToLiquidation",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerProfitsLessThanExpected",
    inputs: [
      {
        name: "assetBalanceReceived",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "assetsUtilized",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "lenderProfits",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerRemovedFromWhitelist",
    inputs: [
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BorrowerWhitelisted",
    inputs: [
      {
        name: "borrower",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ContractPaused",
    inputs: [
      {
        name: "paused",
        type: "bool",
        indexed: true,
        internalType: "bool",
      },
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assets",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EarlyWithdrawalFeeSet",
    inputs: [
      {
        name: "earlyWithdrawalFee",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FirstActualStrategyIdSet",
    inputs: [
      {
        name: "prev",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "current",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LenderYieldWithdrawn",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "strategyIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "yield",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Liquidation",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assetsReceived",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LiquidationFailed",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "reason",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LiquidationFeeSet",
    inputs: [
      {
        name: "liquidationFee",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LiquidationPriceDiffSet",
    inputs: [
      {
        name: "liquidationPriceDiff",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LiquidationRequest",
    inputs: [
      {
        name: "vault",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "positions",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinBaseAssetCollateralAmountSet",
    inputs: [
      {
        name: "minBaseAssetCollateralAmount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PendingBorrowerPositionAdded",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "strategyId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "collateralType",
        type: "uint8",
        indexed: false,
        internalType: "enum TypeLib.CollateralType",
      },
      {
        name: "collateralAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "assetsToBorrow",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "minAssetsOut",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "liquidationPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ReverseRouteChanged",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newReverseRoute",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RouteChanged",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newRoute",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetAsset",
    inputs: [
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "contract IERC20",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetAttestationContract",
    inputs: [
      {
        name: "attestationContract",
        type: "address",
        indexed: true,
        internalType: "contract IAutomataDcapAttestationFee",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetCurator",
    inputs: [
      {
        name: "curator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetCuratorTimelock",
    inputs: [
      {
        name: "curatorTimelock",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetFeeReceiver",
    inputs: [
      {
        name: "feeBeneficiary",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetLiquidator",
    inputs: [
      {
        name: "liquidator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetMrEnclaveExpected",
    inputs: [
      {
        name: "mrEnclaveExpected",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetOracle",
    inputs: [
      {
        name: "oracle",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetRiskLevel",
    inputs: [
      {
        name: "vault",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "riskLevel",
        type: "uint8",
        indexed: true,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SetVaultRegistry",
    inputs: [
      {
        name: "vaultRegistry",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SpreadFeeSet",
    inputs: [
      {
        name: "spreadFee",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StrategyAdded",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "addr",
        type: "address",
        indexed: true,
        internalType: "contract IERC20",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "borrowApr",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StrategyDisabled",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StrategyShadowed",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newStrategyId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newApr",
        type: "uint40",
        indexed: false,
        internalType: "uint40",
      },
      {
        name: "newName",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UnfinishedSwap",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UnpaidYieldChange",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "lender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VaultDeployed",
    inputs: [
      {
        name: "vault",
        type: "address",
        indexed: true,
        internalType: "contract IVaultProxy",
      },
      {
        name: "asset",
        type: "address",
        indexed: true,
        internalType: "contract IERC20",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "symbol",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "riskLevel",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "receiver",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assets",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "shares",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
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
    name: "AttestationFailed",
    inputs: [
      {
        name: "output",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
  {
    type: "error",
    name: "BaseAssetDeficitAmountOverflow",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "baseAssetDeficit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "BlockHashNotExists",
    inputs: [
      {
        name: "blockNumber",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "BlockHashesMismatch",
    inputs: [
      {
        name: "hash1",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "hash2",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "BlockMismatch",
    inputs: [
      {
        name: "blockNumber",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "blockHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "blockHashReal",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "BlockNumberTooOld",
    inputs: [],
  },
  {
    type: "error",
    name: "BorrowRequestExpired",
    inputs: [],
  },
  {
    type: "error",
    name: "BorrowRequestNotExpired",
    inputs: [],
  },
  {
    type: "error",
    name: "BorrowerAlreadyWhitelisted",
    inputs: [],
  },
  {
    type: "error",
    name: "BorrowerNotWhitelisted",
    inputs: [],
  },
  {
    type: "error",
    name: "BorrowerPositionOverflow",
    inputs: [],
  },
  {
    type: "error",
    name: "BorrowersNotFinished",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "CallAlreadyPending",
    inputs: [],
  },
  {
    type: "error",
    name: "CallNotReady",
    inputs: [
      {
        name: "unlockTime",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "CallNotRequested",
    inputs: [],
  },
  {
    type: "error",
    name: "ContractIsPaused",
    inputs: [
      {
        name: "reason",
        type: "string",
        internalType: "string",
      },
    ],
  },
  {
    type: "error",
    name: "ContractNotPaused",
    inputs: [],
  },
  {
    type: "error",
    name: "CuratorOnly",
    inputs: [],
  },
  {
    type: "error",
    name: "CuratorTimelockOnly",
    inputs: [],
  },
  {
    type: "error",
    name: "EmptyRoute",
    inputs: [],
  },
  {
    type: "error",
    name: "FailedCall",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
  {
    type: "error",
    name: "InsufficientAmountOut",
    inputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minAmountOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InsufficientAssets",
    inputs: [
      {
        name: "availableAssets",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "assetsToLock",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InsufficientAssetsReceivedForPosition",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "returned",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minAssetsOut",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "InterceptedAdapterNotInRoute",
    inputs: [
      {
        name: "interceptedOnAdapter",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidAmountIn",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAmountOut",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAsset",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAssetDecimals",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidAttestationContract",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidBase",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidBorrow",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidBorrowApr",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidBorrower",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidBorrowerPosition",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidContract",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidCurator",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidCuratorTimelock",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidDeadline",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidDepositAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidERC4626",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidEarlyWithdrawalFee",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidEndDate",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidFeeReceiver",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInputLength",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInputTokenIndex",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLenderPointsUpdateTime",
    inputs: [
      {
        name: "currentTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lastUpdateTime",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidLeverage",
    inputs: [
      {
        name: "leverage",
        type: "uint24",
        internalType: "uint24",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidLiquidation",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLiquidationFee",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLiquidationPrice",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLiquidationPriceDiff",
    inputs: [
      {
        name: "liquidationPriceDiff",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidLiquidator",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMarket",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMinBaseAssetCollateralAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMinter",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMrEnclave",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidMrEnclaveExpected",
    inputs: [
      {
        name: "expected",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "actual",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidName",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidOracle",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidOutputLength",
    inputs: [
      {
        name: "length",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidOutputTokenIndex",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidPool",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRoute",
    inputs: [
      {
        name: "_type",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidRouter",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidSpreadFee",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidStrategy",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidStrategyAssets",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidStrategyBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidStrategyOrder",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidStrategyType",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidToken",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidTokenIn",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidTokenOut",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidUser",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidVaultRegistry",
    inputs: [],
  },
  {
    type: "error",
    name: "LenderAlreadyWhitelisted",
    inputs: [],
  },
  {
    type: "error",
    name: "LenderNotWhitelisted",
    inputs: [],
  },
  {
    type: "error",
    name: "LiquidatorOnly",
    inputs: [],
  },
  {
    type: "error",
    name: "NoStrategies",
    inputs: [],
  },
  {
    type: "error",
    name: "NotEnoughCollateral",
    inputs: [
      {
        name: "collateralGiven",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "minCollateral",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "OnlyCallsAllowed",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyVaultAllowed",
    inputs: [],
  },
  {
    type: "error",
    name: "OracleOnly",
    inputs: [],
  },
  {
    type: "error",
    name: "PayloadHashesMismatch",
    inputs: [
      {
        name: "hash1",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "hash2",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "PositionAddingFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "PositionCountInconsistency",
    inputs: [],
  },
  {
    type: "error",
    name: "PositionDataHashesMismatch",
    inputs: [
      {
        name: "hash1",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "hash2",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "PositionFinishFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "PositionNotSubjectToLiquidation",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PositionRemoveFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "PreviewLiquidateQuote",
    inputs: [
      {
        name: "liquidationCount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "assetsToReceive",
        type: "uint256[][]",
        internalType: "uint256[][]",
      },
    ],
  },
  {
    type: "error",
    name: "ProofAlreadyUsed",
    inputs: [
      {
        name: "proof",
        type: "bytes",
        internalType: "bytes",
      },
    ],
  },
  {
    type: "error",
    name: "SameBlock",
    inputs: [],
  },
  {
    type: "error",
    name: "SelectorNotFound",
    inputs: [],
  },
  {
    type: "error",
    name: "StrategyArchived",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "StrategyAssetsUnderflow",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "strategyAssets",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "assets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "StrategyBalanceAmountOverflow",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "strategyBalance",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "StrategyEnded",
    inputs: [],
  },
  {
    type: "error",
    name: "StrategyIsDisabled",
    inputs: [],
  },
  {
    type: "error",
    name: "StrategyNotFinished",
    inputs: [],
  },
  {
    type: "error",
    name: "SwapNotFinished",
    inputs: [],
  },
  {
    type: "error",
    name: "TooMuchDeficitToFill",
    inputs: [
      {
        name: "deficitToFill",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "currentBaseAssetDeficit",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "TotalAssetsUtilizedAmountOverflow",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "totalAssetsUtilized",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "TotalAssetsUtilizedMismatch",
    inputs: [
      {
        name: "totalAssetsUtilized",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "totalAssets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "TotalDebtUnderflow",
    inputs: [
      {
        name: "totalDebt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "newLenderPointsDebt",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "lenderPointsDebt",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "TotalLenderAssetsLockedAmountUnderflow",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "totalLenderAssetsLocked",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "TransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "TransfersDisabled",
    inputs: [],
  },
  {
    type: "error",
    name: "UnfinishedSwapAlreadyExists",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "UnfinishedSwapNotExists",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "UnfinishedSwapNotFinished",
    inputs: [
      {
        name: "positionId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "UnpaidYieldAmountOverflow",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "unpaidYield",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "UserDebtOverflow",
    inputs: [
      {
        name: "accruedFromShares",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "userDebt",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "VaultNotFound",
    inputs: [
      {
        name: "vault",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "VaultNotWhitelisted",
    inputs: [],
  },
  {
    type: "error",
    name: "WithdrawAmountExceedsMax",
    inputs: [
      {
        name: "maxWithdraw",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "WrongStrategy",
    inputs: [
      {
        name: "strategyId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const satisfies Abi;
