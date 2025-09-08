"use client";

import React, { createContext, ReactElement, useState } from "react";
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

  toastActions.actions = {
    create: ({ message }: CreateToastData): void =>
      setQueue(
        produce(draft => {
          if (appearOnTop) {
            while (draft.length >= maxToastsToShow) {
              draft.pop();
            }

            draft.unshift({
              id: uniqueId("toast-"),
              message,
              open: true,
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
          });
        })
      ),

    remove: (id: string) => setQueue(queue.filter(x => x.id !== id)),
  };

  useHotkeys("esc", () => {
    if (queue.length > 0) {
      const item = appearOnTop ? queue[0] : queue[queue.length - 1];
      toastActions.actions.remove(item.id);
    }
  });

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
            "z-50 gap-2 px-4 py-2"
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
