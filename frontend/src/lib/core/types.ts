import type { Vault } from "@diffuse/sdk-js";
import { Address } from "viem";

export type VaultWithAddress = {
  name: string;
  address: Address;
  vault: Vault;
};
