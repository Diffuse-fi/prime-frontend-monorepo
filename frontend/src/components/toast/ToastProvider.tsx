"use client";

import React, { createContext, ReactElement, useEffect, useState } from "react";
import uniqueId from "lodash/uniqueId";
import {
  CreateToastData,
  RenderToastData,
  toastActions,
  ToastPosition,
} from "@/lib/toast";
import { Portal } from "react-portal";
import { useHotkeys } from "react-hotkeys-hook";
import { cn, Toast } from "@diffuse/ui-kit";
import { produce } from "immer";

export interface ToastProviderProps {
  maxToastsToShow?: number;
  defaultPosition?: ToastPosition;
  closeable?: boolean;
  duration?: number;
  appearOnTop?: boolean;
}

type ToastsContainerContextModel = {
  queue: RenderToastData[];
};

const ToastProviderContext = createContext<ToastsContainerContextModel>(
  {} as ToastsContainerContextModel
);

export default function ToastProvider({
  maxToastsToShow = 5,
  defaultPosition = "bottom-right",
  closeable = true,
  duration = 5000,
  appearOnTop = true,
}: ToastProviderProps): ReactElement {
  const [queue, setQueue] = useState<RenderToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    toastActions.actions = {
      create: ({ message, ...rest }: CreateToastData): void =>
        setQueue(prev =>
          produce(prev, draft => {
            if (appearOnTop) {
              while (draft.length >= maxToastsToShow) {
                draft.pop();
              }

              draft.unshift({
                id: uniqueId("toast-"),
                message,
                open: true,
                ...rest,
              });

              return;
            }

            while (draft.length >= maxToastsToShow) {
              draft.shift();
            }

            draft.push({
              id: uniqueId("toast-"),
              message,
              open: true,
              ...rest,
            });
          })
        ),

      remove: (id: string) => setQueue(prev => prev.filter(x => x.id !== id)),
    };

    return () => {
      toastActions.actions = {
        create: () => {},
        remove: () => {},
      };
    };
  }, [mounted, appearOnTop, maxToastsToShow]);

  useHotkeys(
    "esc",
    () => {
      if (!mounted) return;

      setQueue(prev => {
        if (prev.length === 0) return prev;

        const index = appearOnTop ? 0 : prev.length - 1;
        const id = prev[index].id;

        return prev.filter(x => x.id !== id);
      });
    },
    [mounted, appearOnTop]
  );

  if (!mounted) {
    return <></>;
  }

  return (
    <ToastProviderContext.Provider value={{ queue }}>
      <Portal node={document.body}>
        <ul
          className={cn(
            "pointer-events-none fixed flex w-fit list-none flex-col",
            defaultPosition === "top-left" && "top-4 left-4 items-start",
            defaultPosition === "top-right" && "top-4 right-4 items-end",
            defaultPosition === "bottom-left" && "bottom-4 left-4 items-start",
            defaultPosition === "bottom-right" && "right-4 bottom-4 items-end",
            "z-110 max-w-[400px] gap-2 px-4 py-2"
          )}
          role="region"
          aria-label="Notifications"
        >
          {queue.map(toast => (
            <Toast
              className="animate-in-zoom-fade pointer-events-auto transition-transform hover:-translate-y-1 hover:scale-[1.02]"
              key={toast.id}
              closeable={toast.closeable ?? closeable}
              duration={toast.duration ?? duration}
              open={toast.open}
              onClose={() => toastActions.actions.remove(toast.id)}
              message={toast.message}
              title={toast.title}
            />
          ))}
        </ul>
      </Portal>
    </ToastProviderContext.Provider>
  );
}
