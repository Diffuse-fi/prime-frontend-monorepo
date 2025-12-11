import { ToastProps } from "@diffuse/ui-kit";

export type CreateToastData = {
  closeable?: boolean;
  duration?: number;
  message: string;
  position?: ToastPosition;
  title?: string;
};

export type RenderToastData = ToastProps & {
  id: string;
};

export type ToastPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";

type NotificationActions = {
  create: (data: CreateToastData) => void;
  remove: (id: string) => void;
};

export const toastActions: { actions: NotificationActions } = {
  actions: {
    create: () => {},
    remove: () => {},
  },
};

export function toast(data: CreateToastData | string) {
  if (typeof data === "string") {
    toastActions.actions.create({ message: data });
    return;
  }

  toastActions.actions.create({ ...data });
}
