"use client";

import { useOnlineStatus } from "@/lib/misc/useOnlineStatus";
import { toast } from "@/lib/toast";

export function ConnectionStatusTracker() {
  useOnlineStatus({
    onReconnect: () => {
      toast("Back online — refreshing data");
    },
    onDisconnect: () => {
      toast("You are offline");
    },
  });

  return null;
}
