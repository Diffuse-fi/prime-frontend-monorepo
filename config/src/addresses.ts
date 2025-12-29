import z from "zod";

import { AddressSchema, ChainIdSchema } from "./common";

export const ADDRESSES: Addresses = {
  chains: [
    {
      chainId: 1,
      contracts: {
        Viewer: {
          current: "0x2B29dEa1231AA37929d11Aa176D6643181482B22",
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
