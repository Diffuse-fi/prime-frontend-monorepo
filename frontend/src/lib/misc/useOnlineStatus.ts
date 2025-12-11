"use client";

import { onlineManager } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type UseOnlineReconnectParams = {
  onDisconnect?: () => void;
  onReconnect: () => void;
};

export function useOnlineStatus({ onDisconnect, onReconnect }: UseOnlineReconnectParams) {
  const prevOnline = useRef(onlineManager.isOnline());

  useEffect(() => {
    const connectionStatusListener = (isOnline: boolean) => {
      if (!prevOnline.current && isOnline) {
        onReconnect();
      } else if (prevOnline.current && !isOnline) {
        onDisconnect?.();
      }

      prevOnline.current = isOnline;
    };

    onlineManager.subscribe(connectionStatusListener);
  }, [onReconnect, onDisconnect]);
}
