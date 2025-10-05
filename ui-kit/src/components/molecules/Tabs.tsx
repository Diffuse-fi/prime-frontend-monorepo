import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { tv, type VariantProps } from "@/lib";
import { cn } from "@/lib";

const tabsList = tv({
  base: "relative inline-flex items-center gap-1 rounded-sm",
  variants: {
    size: {
      sm: "h-9 px-1",
      md: "h-10 px-1.5",
      lg: "h-11 px-2",
    },
    align: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between w-full",
    },
    variant: {
      underline: "border-b border-border",
      solid: "bg-muted/40 p-1 rounded-lg",
      pill: "bg-transparent",
    },
    fitted: {
      true: "grid auto-cols-fr grid-flow-col w-full",
      false: "flex",
    },
  },
  defaultVariants: { size: "md", align: "start", variant: "underline", fitted: false },
});

const tabsTrigger = tv({
  base: [
    "group inline-flex items-center gap-2 select-none",
    "rounded-xs px-3 py-2 -mb-[1px]",
    "text-sm font-medium text-text-dimmed",
    "whitespace-nowrap standard-focus-ring",
    "transition-colors duration-150",
    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  ].join(" "),
  variants: {
    size: {
      sm: "text-sm px-2.5 py-1.5",
      md: "text-sm px-3 py-2",
      lg: "text-base px-4 py-2.5",
    },
    variant: {
      underline:
        "border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-text-primary hover:text-text-primary/90",
      solid:
        "rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-fg hover:bg-muted/60",
      pill: "rounded-full data-[state=active]:bg-primary/10 data-[state=active]:text-text-primary hover:bg-muted/40",
    },
    fitted: {
      true: "justify-center w-full",
      false: "",
    },
    tone: {
      default: "",
      muted: "text-muted data-[state=active]:text-text-primary",
      primary: "data-[state=active]:text-primary",
    },
  },
  defaultVariants: { size: "md", variant: "underline", fitted: false, tone: "default" },
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
  ({ className, size, align, variant, fitted, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsList({ size, align, variant, fitted }), className)}
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
  (
    { className, size, variant, fitted, tone, left, right, count, children, ...props },
    ref
  ) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTrigger({ size, variant, fitted, tone }), className)}
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
