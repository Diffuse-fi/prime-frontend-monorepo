import * as React from "react";
import { NavigationMenu } from "radix-ui";
import { cn, tv } from "@/lib";

export type NavVariant = "default" | "tabs";

export interface NavItem {
  href: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  active?: boolean;
}

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  listClassName?: string;
  itemClassName?: string;
  activeClassName?: string;
  variant?: NavVariant;
  dir?: "ltr" | "rtl";
}

const root = tv({
  base: "flex items-center gap-2",
  variants: {
    variant: {
      default: "",
      tabs: "border-b border-border",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const Nav = React.forwardRef<HTMLElement, NavProps>(
  (
    {
      items,
      listClassName,
      itemClassName,
      activeClassName,
      className,
      defaultValue,
      variant = "default",
      ...rest
    },
    ref
  ) => {
    return (
      <NavigationMenu.Root ref={ref} className={root({ variant, className })} {...rest}>
        <NavigationMenu.List className={cn("flex gap-2", listClassName)}>
          {items.map(item => {
            const active = item.active ?? false;
            const content = (
              <>
                {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                <span>{item.label}</span>
              </>
            );

            if (item.disabled) {
              return (
                <li
                  key={item.href}
                  className={cn(
                    "opacity-50 cursor-not-allowed flex items-center gap-1 px-3 py-2 rounded-[var(--ui-radius,10px)]",
                    item.className
                  )}
                >
                  {content}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-[var(--ui-radius,10px)] transition-colors",
                    "hover:bg-[color:var(--ui-border)]/20",
                    active
                      ? cn(
                          "bg-[color:var(--ui-primary)] text-[color:var(--ui-primary-fg)]",
                          activeClassName
                        )
                      : "text-[color:var(--ui-fg)]",
                    itemClassName,
                    item.className
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {content}
                </Link>
              </li>
            );
          })}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    );
  }
);

Nav.displayName = "Nav";
