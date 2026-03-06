import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib";

type CollapsibleCommonProps = {
  summary: React.ReactNode;
  summaryClassName?: string;
};

type ControlledCollapsibleProps = CollapsibleCommonProps &
  Omit<React.HTMLAttributes<HTMLDetailsElement>, "onToggle"> & {
    onOpenChange?: (open: boolean) => void;
    open: boolean;
  };

type UncontrolledCollapsibleProps = CollapsibleCommonProps &
  Omit<React.HTMLAttributes<HTMLDetailsElement>, "onToggle"> & {
    defaultOpen?: boolean;
  };

const CollapsibleSummary = ({
  open,
  summary,
  summaryClassName,
}: {
  open: boolean;
  summary: React.ReactNode;
  summaryClassName?: string;
}) => {
  return (
    <summary
      className={cn(
        "standard-focus-ring flex cursor-pointer list-none items-center select-none",
        summaryClassName
      )}
    >
      <p className="text-sm font-semibold">{summary}</p>
      <ChevronDown
        className={`ml-1 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        size={16}
      />
    </summary>
  );
};

export const ControlledCollapsible = React.forwardRef<
  HTMLDetailsElement,
  ControlledCollapsibleProps
>(function ControlledCollapsible(
  { children, onOpenChange, open, summary, summaryClassName, ...rest },
  ref
) {
  return (
    <details
      open={open}
      ref={ref}
      {...rest}
      onToggle={e => onOpenChange?.((e.currentTarget as HTMLDetailsElement).open)}
    >
      <CollapsibleSummary
        open={open}
        summary={summary}
        summaryClassName={summaryClassName}
      />
      <div className="mt-2">{children}</div>
    </details>
  );
});
ControlledCollapsible.displayName = "ControlledCollapsible";

export const UncontrolledCollapsible = React.forwardRef<
  HTMLDetailsElement,
  UncontrolledCollapsibleProps
>(function UncontrolledCollapsible(
  { children, defaultOpen = false, summary, summaryClassName, ...rest },
  ref
) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <details
      open={open}
      ref={ref}
      {...rest}
      onToggle={e => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <CollapsibleSummary
        open={open}
        summary={summary}
        summaryClassName={summaryClassName}
      />
      <div className="mt-2">{children}</div>
    </details>
  );
});

UncontrolledCollapsible.displayName = "UncontrolledCollapsible";
