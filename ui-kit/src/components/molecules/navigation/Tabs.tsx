import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { tv, type VariantProps } from "@/lib";
import { cn } from "@/lib";

const tabsList = tv({
  base: "relative inline-flex items-center gap-1 rounded-sm h-10 px-1.5",
  variants: {
    align: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between w-full",
    },
    fitted: {
      true: "grid auto-cols-fr grid-flow-col w-full",
      false: "flex",
    },
  },
  defaultVariants: { align: "start", fitted: false },
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
  variants: {
    fitted: {
      true: "justify-center w-full",
      false: "",
    },
  },
  defaultVariants: { fitted: false },
});

const tabsContent = tv({
  base: "pt-3 outline-none focus-visible:standard-focus-ring",
  variants: {
    inset: { true: "mt-2", false: "" },
  },
  defaultVariants: { inset: false },
});

export type TabsRootProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
export const TabsRoot = TabsPrimitive.Root;

type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsList>;
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, align, fitted, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsList({ align, fitted }), className)}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

type TriggerBaseProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;
export type TabsTriggerProps = TriggerBaseProps &
  VariantProps<typeof tabsTrigger> & {
    left?: React.ReactNode;
    right?: React.ReactNode;
    count?: number | string;
  };

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, fitted, left, right, count, children, ...props }, ref) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTrigger({ fitted }), className)}
        {...props}
      >
        {left && <span className="shrink-0">{left}</span>}
        <span className="min-w-0 overflow-hidden text-ellipsis">{children}</span>
        {typeof count !== "undefined" && (
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
        ref={ref}
        className={cn(tabsContent({ inset }), className)}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
