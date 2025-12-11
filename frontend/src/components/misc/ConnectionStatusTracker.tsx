"use client";

import { useOnlineStatus } from "@/lib/misc/useOnlineStatus";
import { toast } from "@/lib/toast";

export function ConnectionStatusTracker() {
  useOnlineStatus({
    onDisconnect: () => {
      toast("You are offline");
    },
    onReconnect: () => {
      toast("Back online — refreshing data");
    },
  });

  return null;
}
