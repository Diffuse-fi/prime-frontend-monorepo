import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";

import { tv, type VariantProps } from "@/lib";
import { cn } from "@/lib";

const tabsList = tv({
  base: "relative inline-flex items-center gap-1 rounded-sm h-10 px-1.5",
  defaultVariants: { align: "start", fitted: false },
  variants: {
    align: {
      between: "justify-between w-full",
      center: "justify-center",
      end: "justify-end",
      start: "justify-start",
    },
    fitted: {
      false: "flex",
      true: "grid auto-cols-fr grid-flow-col w-full",
    },
  },
});

const tabsTrigger = tv({
  base: [
    "group inline-flex items-center gap-2 select-none",
    "px-3 py-2",
    "font-medium text-text-dimmed",
    "whitespace-nowrap standard-focus-ring",
    "transition-colors",
    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    "border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary",
  ].join(" "),
  defaultVariants: { fitted: false },
  variants: {
    fitted: {
      false: "",
      true: "justify-center w-full",
    },
  },
});

const tabsContent = tv({
  base: "pt-3 outline-none focus-visible:standard-focus-ring",
  defaultVariants: { inset: false },
  variants: {
    inset: { false: "", true: "mt-2" },
  },
});

export type TabsRootProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
export const TabsRoot = TabsPrimitive.Root;

type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsList>;
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ align, className, fitted, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        className={cn(tabsList({ align, fitted }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

export type TabsTriggerProps = TriggerBaseProps &
  VariantProps<typeof tabsTrigger> & {
    count?: number | string;
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
type TriggerBaseProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, className, count, fitted, left, right, ...props }, ref) => {
    return (
      <TabsPrimitive.Trigger
        className={cn(tabsTrigger({ fitted }), className)}
        ref={ref}
        {...props}
      >
        {left && <span className="shrink-0">{left}</span>}
        <span className="min-w-0 overflow-hidden text-ellipsis">{children}</span>
        {count !== undefined && (
          <span
            className={cn(
              "ml-1 inline-flex items-center rounded-full px-1.5 text-[11px] leading-[18px]",
              "bg-muted text-text-dimmed",
              "group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-fg"
            )}
          >
            {count}
          </span>
        )}
        {right && <span className="shrink-0">{right}</span>}
      </TabsPrimitive.Trigger>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
> &
  VariantProps<typeof tabsContent>;
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <TabsPrimitive.Content
        className={cn(tabsContent({ inset }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export const Tabs = Object.assign(TabsRoot, {
  Content: TabsContent,
  List: TabsList,
  Trigger: TabsTrigger,
});
