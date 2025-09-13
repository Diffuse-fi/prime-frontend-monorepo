"use client";

import { Skeleton } from "@diffuse/ui-kit";
import dynamic from "next/dynamic";

const WalletBarComponent = dynamic(() => import("./WalletBar"), {
  ssr: false,
  loading: () => <Skeleton className="h-8 w-24 rounded-lg" />,
});

export default function WalletBar() {
  return <WalletBarComponent />;
}
