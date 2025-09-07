import { ToastProps } from "@diffuse/ui-kit";

export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type RenderToastData = {
  id: string;
} & ToastProps;

export type CreateToastData = {
  message: string;
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

export function toast(message: string) {
  toastActions?.actions.create({ message });
}
