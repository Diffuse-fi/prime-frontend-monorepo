"use client";

import { getAddress, type Address, type Log } from "viem";
import { useWatchContractEvent } from "wagmi";
import { vaultAbi } from "@diffuse/sdk-js";

type Params = {
  vaultAddresses: Address[];
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
    address: vaultAddresses,
    abi: vaultAbi,
    eventName: "BorrowerPositionActivated",
    chainId,
    enabled: enabled && !!vaultAddresses?.length,
    poll: true,
    pollingInterval: 4000,
    onLogs: logs => {
      console.log("BorrowerPositionActivated logs", logs);
      for (const log of logs) {
        if (account) {
          const user = (log.args as { user: Address }).user;

          if (getAddress(user) !== getAddress(account)) continue;
        }

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
