import { Address, getAddress, isAddress } from "viem";
import z from "zod";

export const AddressSchema = z
  .string()
  .trim()
  .refine(s => isAddress(s), { message: "Invalid EVM address" })
  .transform(s => getAddress(s as Address));

export const ChainIdSchema = z.number().int().nonnegative();
