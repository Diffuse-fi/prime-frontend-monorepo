import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib";

type CollapsibleCommonProps = {
  summary: string;
  summaryClassName?: string;
};

type ControlledCollapsibleProps = Omit<
  React.HTMLAttributes<HTMLDetailsElement>,
  "onToggle"
> & {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
} & CollapsibleCommonProps;

type UncontrolledCollapsibleProps = Omit<
  React.HTMLAttributes<HTMLDetailsElement>,
  "onToggle"
> & {
  defaultOpen?: boolean;
} & CollapsibleCommonProps;

const CollapsibleSummary = ({
  summary,
  open,
  summaryClassName,
}: {
  summary: string;
  open: boolean;
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
  { open, onOpenChange, summary, summaryClassName, children, ...rest },
  ref
) {
  return (
    <details
      ref={ref}
      open={open}
      {...rest}
      onToggle={e => onOpenChange?.((e.currentTarget as HTMLDetailsElement).open)}
    >
      <CollapsibleSummary
        summary={summary}
        open={open}
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
  { defaultOpen = false, summary, summaryClassName, children, ...rest },
  ref
) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <details
      ref={ref}
      open={open}
      {...rest}
      onToggle={e => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <CollapsibleSummary
        summary={summary}
        open={open}
        summaryClassName={summaryClassName}
      />
      <div className="mt-2">{children}</div>
    </details>
  );
});

UncontrolledCollapsible.displayName = "UncontrolledCollapsible";
