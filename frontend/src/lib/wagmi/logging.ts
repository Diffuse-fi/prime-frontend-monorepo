"use client";

import { watchAccount } from "@wagmi/core";

import { config } from "@/lib/wagmi/config";

import { walletLogger } from "../core/utils/loggers";

export function installWagmiWatchers() {
  const unwatchAccount = watchAccount(config, {
    onChange(acct, prev) {
      walletLogger.info("account change", {
        from: prev?.address,
        status: acct.status,
        to: acct.address,
      });
    },
  });

  return () => {
    unwatchAccount();
  };
}
