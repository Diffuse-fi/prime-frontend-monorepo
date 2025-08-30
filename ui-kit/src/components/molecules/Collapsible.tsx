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
      <summary className="cursor-pointer select-none list-none underline decoration-dashed flex items-center">
        <Text weight="semibold" size="small">
          {summary}
        </Text>
        <ChevronDown
          className={`ml-1 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          size={16}
        />
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
});

ControlledCollapsible.displayName = "ControlledCollapsible";
