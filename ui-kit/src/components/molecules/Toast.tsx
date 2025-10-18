import * as React from "react";
import { IconButton } from "../atoms/index.js";
import { X } from "lucide-react";
import { cn } from "@/lib";

export interface ToastProps extends React.HTMLAttributes<HTMLLIElement> {
  open: boolean;
  closeable?: boolean;
  duration?: number;
  message: string | React.ReactNode;
  title?: string;
  onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  (
    { closeable, open, duration, title, message, onClose, className, role = "status" },
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
        ref={ref}
        className={cn("shadow-strong bg-fg flex gap-2 rounded-md p-4", className)}
        role={role}
        aria-live="polite"
        aria-atomic="true"
        onMouseEnter={pause}
        onMouseLeave={resume}
        data-state={open ? "open" : "closed"}
      >
        <div className="flex flex-1 items-center rounded-md">
          <div className="flex flex-1 flex-col">
            {title && <p className="mb-1 font-semibold">{title}</p>}
            {typeof message === "string" ? (
              <p className="whitespace-pre-wrap">{message}</p>
            ) : (
              message
            )}
          </div>
        </div>
        {closeable && (
          <IconButton
            type="button"
            className="ml-2"
            aria-label="Close toast notification"
            icon={<X />}
            onClick={onClose}
            variant="ghost"
          />
        )}
      </li>
    );
  }
);

Toast.displayName = "Toast";
