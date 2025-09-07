import * as React from "react";
import { IconButton, Text } from "../atoms/index";
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
        className={cn("flex p-4 shadow-strong rounded-b-lg gap-2", className)}
        role={role}
        aria-live="polite"
        aria-atomic="true"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="flex flex-1 items-center rounded-md bg-foreground/10">
          <div className="flex flex-1 flex-col">
            {title && (
              <Text size="small" weight="semibold" className="mb-1">
                {title}
              </Text>
            )}
            {typeof message === "string" ? (
              <Text size="small" className="whitespace-pre-wrap">
                {message}
              </Text>
            ) : (
              message
            )}
          </div>
        </div>
        {closeable && (
          <IconButton
            type="button"
            className="ml-2"
            aria-label="Close notification"
            icon={<X />}
            onClick={onClose}
          />
        )}
      </li>
    );
  }
);

Toast.displayName = "Toast";
