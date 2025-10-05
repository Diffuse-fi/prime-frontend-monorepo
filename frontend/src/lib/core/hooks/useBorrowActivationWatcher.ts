"use client";

import type { Address, Log } from "viem";
import { useWatchContractEvent } from "wagmi";
import { vaultAbi } from "@diffuse/sdk-js";

type Params = {
  vaultAddresses?: Address[];
  chainId?: number;
  account?: Address;
  enabled?: boolean;
  onActivated?: (args: { strategyId: bigint; id: bigint; log: Log }) => void;
};

export function useBorrowActivationWatcher({
  vaultAddresses,
  chainId,
  account,
  enabled = true,
  onActivated,
}: Params) {
  useWatchContractEvent({
    address: vaultAddresses ?? [],
    abi: vaultAbi,
    eventName: "BorrowerPositionActivated",
    chainId,
    ...(account ? ({ args: { user: account } } as const) : {}),
    enabled: enabled && !!vaultAddresses?.length,
    onLogs: logs => {
      console.log("BorrowerPositionActivated logs", logs);
      for (const log of logs) {
        const { strategyId, id } = log.args as {
          strategyId: bigint;
          id: bigint;
          user: Address;
        };
        onActivated?.({ strategyId, id: id, log });
      }
    },
  });
}
