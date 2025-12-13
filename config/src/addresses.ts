import z from "zod";

import { AddressSchema, ChainIdSchema } from "./common";

export const ADDRESSES: Addresses = {
  chains: [
    {
      chainId: 1,
      contracts: {
        Viewer: {
          current: "0x6cc9bF3151Ff39846B0570CED355Ded5C0Bb7D76",
        },
      },
      name: "Mainnet",
    },
  ],
};

export const AddressesSchema = z.object({
  chains: z.array(
    z.object({
      chainId: ChainIdSchema,
      contracts: z.record(
        z.string(),
        z.object({
          current: AddressSchema,
        })
      ),
      name: z.string(),
    })
  ),
});

export type Addresses = z.infer<typeof AddressesSchema>;
