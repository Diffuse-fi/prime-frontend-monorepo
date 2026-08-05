import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib";

import { IconButton } from "../../../atoms";

export interface ToastProps extends React.HTMLAttributes<HTMLLIElement> {
  closeable?: boolean;
  duration?: number;
  message: React.ReactNode | string;
  onClose?: () => void;
  open: boolean;
  title?: string;
}

export const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  (
    { className, closeable, duration, message, onClose, open, role = "status", title },
    ref
  ) => {
    const timeout = React.useRef<NodeJS.Timeout>(null);

    const pause = React.useCallback(() => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    }, []);

    const resume = React.useCallback(() => {
      if (duration && onClose) {
        timeout.current = setTimeout(() => {
          onClose();
        }, duration);
      }
    }, [duration, onClose]);

    React.useEffect(() => {
      if (open) {
        resume();
      } else {
        pause();
      }
      return () => pause();
    }, [open, pause, resume]);

    if (!open) {
      return null;
    }

    return (
      <li
        aria-atomic="true"
        aria-live="polite"
        className={cn(
          "shadow-strong bg-fg flex w-full min-w-0 gap-2 rounded-md p-4",
          className
        )}
        data-state={open ? "open" : "closed"}
        onMouseEnter={pause}
        onMouseLeave={resume}
        ref={ref}
        role={role}
      >
        <div className="flex min-w-0 flex-1 items-center rounded-md">
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <p className="mb-1 font-semibold [overflow-wrap:anywhere] break-words">
                {title}
              </p>
            )}
            {typeof message === "string" ? (
              <p
                className="[display:-webkit-box] overflow-hidden [overflow-wrap:anywhere] break-words whitespace-pre-wrap [-webkit-box-orient:vertical] [-webkit-line-clamp:4]"
                title={message}
              >
                {message}
              </p>
            ) : (
              message
            )}
          </div>
        </div>
        {closeable && (
          <IconButton
            aria-label="Close toast notification"
            className="ml-2"
            icon={<X />}
            onClick={onClose}
            type="button"
            variant="ghost"
          />
        )}
      </li>
    );
  }
);

Toast.displayName = "Toast";
