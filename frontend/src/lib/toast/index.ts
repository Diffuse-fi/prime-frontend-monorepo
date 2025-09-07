import { ToastProps } from "@diffuse/ui-kit";

export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type RenderToastData = {
  id: string;
} & ToastProps;

export type CreateToastData = {
  message: string;
  position?: ToastPosition;
  duration?: number;
  closeable?: boolean;
  title?: string;
};

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

export function toast(data: string | CreateToastData) {
  if (typeof data === "string") {
    toastActions.actions.create({ message: data });
    return;
  }

  toastActions.actions.create({ ...data });
}
