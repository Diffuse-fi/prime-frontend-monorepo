"use client";

import { cn, Toast } from "@diffuse/ui-kit";
import { produce } from "immer";
import uniqueId from "lodash/uniqueId";
import React, { createContext, ReactElement, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Portal } from "react-portal";

import {
  CreateToastData,
  RenderToastData,
  toastActions,
  ToastPosition,
} from "@/lib/toast";

export interface ToastProviderProps {
  appearOnTop?: boolean;
  closeable?: boolean;
  defaultPosition?: ToastPosition;
  duration?: number;
  maxToastsToShow?: number;
}

type ToastsContainerContextModel = {
  queue: RenderToastData[];
};

const ToastProviderContext = createContext<ToastsContainerContextModel>(
  {} as ToastsContainerContextModel
);

export default function ToastProvider({
  appearOnTop = true,
  closeable = true,
  defaultPosition = "bottom-right",
  duration = 5000,
  maxToastsToShow = 5,
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
          aria-label="Notifications"
          className={cn(
            "pointer-events-none fixed flex w-fit list-none flex-col",
            defaultPosition === "top-left" && "top-4 left-4 items-start",
            defaultPosition === "top-right" && "top-4 right-4 items-end",
            defaultPosition === "bottom-left" && "bottom-4 left-4 items-start",
            defaultPosition === "bottom-right" && "right-4 bottom-4 items-end",
            "z-110 max-w-[400px] gap-2 px-4 py-2"
          )}
          role="region"
        >
          {queue.map(toast => (
            <Toast
              className="animate-in-zoom-fade pointer-events-auto transition-transform hover:-translate-y-1 hover:scale-[1.02]"
              closeable={toast.closeable ?? closeable}
              duration={toast.duration ?? duration}
              key={toast.id}
              message={toast.message}
              onClose={() => toastActions.actions.remove(toast.id)}
              open={toast.open}
              title={toast.title}
            />
          ))}
        </ul>
      </Portal>
    </ToastProviderContext.Provider>
  );
}
