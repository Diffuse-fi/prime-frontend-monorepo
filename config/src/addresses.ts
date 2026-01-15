import z from "zod";

import { AddressSchema, ChainIdSchema } from "./common";

export const ADDRESSES: Addresses = {
  chains: [
    {
      chainId: 1,
      contracts: {
        Viewer: {
          current: "0x68218857D0bD342435A4d31965e1E02551d9C0ea",
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
