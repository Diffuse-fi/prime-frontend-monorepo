import z from "zod";

import { AddressSchema, ChainIdSchema } from "./common";

export const ADDRESSES: Addresses = {
  chains: [
    {
      chainId: 1,
      contracts: {
        Viewer: {
          current: "0xA3bc7553B870cDb7a59070e9a9542309225f026F",
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
