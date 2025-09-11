import { Abi } from "viem";

/** @internal */
export const vaultRegistryAbi = [
  {
    inputs: [
      { internalType: "address", name: "_baseFacet", type: "address" },
      { internalType: "address", name: "_borrowFacet", type: "address" },
      { internalType: "address", name: "_liquidationFacet", type: "address" },
      { internalType: "address", name: "_erc4626Facet", type: "address" },
      {
        internalType: "contract IAutomataDcapAttestationFee",
        name: "_attestationContract",
        type: "address",
      },
      { internalType: "address", name: "_curator", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "attestationContract",
    outputs: [
      { internalType: "contract IAutomataDcapAttestationFee", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseFacet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowFacet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "curator",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "strategy", type: "address" },
      { internalType: "uint256", name: "targetApr", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint256", name: "endDate", type: "uint256" },
    ],
    name: "deployVault",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "erc4626Facet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaults",
    outputs: [
      {
        components: [
          { internalType: "address", name: "vault", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint256", name: "targetApr", type: "uint256" },
          { internalType: "uint8", name: "RiskLevel", type: "uint8" },
        ],
        internalType: "struct TypeLib.VaultViewData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidationFacet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "removeVault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const satisfies Abi;
