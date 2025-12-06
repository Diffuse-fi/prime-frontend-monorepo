"use client";

import { Skeleton } from "@diffuse/ui-kit";
import dynamic from "next/dynamic";

const WalletBarComponent = dynamic(() => import("./WalletBar"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2 sm:gap-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-[120px] rounded-md" />
    </div>
  ),
});

export default function WalletBar() {
  return <WalletBarComponent />;
}
