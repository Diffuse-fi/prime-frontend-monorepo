import * as React from "react";
import { Text } from "@/atoms";
import { ChevronDown } from "lucide-react";

type ControlledCollapsibleProps = Omit<
  React.HTMLAttributes<HTMLDetailsElement>,
  "onToggle"
> & {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  summary: string;
};

type UncontrolledCollapsibleProps = Omit<
  React.HTMLAttributes<HTMLDetailsElement>,
  "onToggle"
> & {
  defaultOpen?: boolean;
  summary: string;
};

const CollapsibleSummary = ({ summary, open }: { summary: string; open: boolean }) => {
  return (
    <summary className="cursor-pointer select-none list-none underline decoration-dashed flex items-center">
      <Text weight="semibold" size="small">
        {summary}
      </Text>
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
  { open, onOpenChange, summary, children, ...rest },
  ref
) {
  return (
    <details
      ref={ref}
      open={open}
      {...rest}
      onToggle={e => onOpenChange?.((e.currentTarget as HTMLDetailsElement).open)}
    >
      <CollapsibleSummary summary={summary} open={open} />
      <div className="mt-2">{children}</div>
    </details>
  );
});
ControlledCollapsible.displayName = "ControlledCollapsible";

export const UncontrolledCollapsible = React.forwardRef<
  HTMLDetailsElement,
  UncontrolledCollapsibleProps
>(function UncontrolledCollapsible(
  { defaultOpen = false, summary, children, ...rest },
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
      <CollapsibleSummary summary={summary} open={open} />
      <div className="mt-2">{children}</div>
    </details>
  );
});

UncontrolledCollapsible.displayName = "UncontrolledCollapsible";
