"use client";

import { ChainSwitcher } from "../ChainSwitcher";
import ConnectButton from "../ConnectButton";

export default function WalletBar() {
  return (
    <div className="flex items-center gap-4">
      <ChainSwitcher />
      <ConnectButton />
    </div>
  );
}
