"use client";

import { useEffect, useRef } from "react";
import { onlineManager } from "@tanstack/react-query";

type UseOnlineReconnectParams = {
  onReconnect: () => void;
  onDisconnect?: () => void;
};

export function useOnlineStatus({ onReconnect, onDisconnect }: UseOnlineReconnectParams) {
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
