import * as React from "react";
import { cn, tv } from "@/lib";
import { Text } from "../atoms";

export type NavVariant = "default" | "tabs";

export interface NavItem {
  href: string;
  label: string;
  disabled?: boolean;
  exact?: boolean;
  external?: boolean;
  target?: string;
  rel?: string;
}

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  "aria-label": string;
  variant?: NavVariant;
  dir?: "ltr" | "rtl";
  listClassName?: string;
  itemClassName?: string;
  activeClassName?: string;
  renderLink?: (props: {
    href: string;
    className?: string;
    children: React.ReactNode;
    "aria-current"?: "page";
    disabled?: boolean;
  }) => React.ReactElement;
  getIsActive?: (item: NavItem, pathname: string) => boolean;
  pathname: string;
}

const list = tv({
  base: "flex items-center gap-2",
  variants: {
    variant: {
      default: "",
      tabs: "border-b [border-color:var(--ui-border)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const linkBase =
  "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium " +
  "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-primary/60 focus-visible:ring-offset-transparent";

const linkVariants: Record<NavVariant, string> = {
  default: "rounded-md text-foreground/80 hover:text-primary",
  tabs: "rounded-none -mb-px border-b-2 border-transparent text-foreground/80 hover:text-primary",
};

const activeVariants: Record<NavVariant, string> = {
  default: "text-primary font-bold",
  tabs: "border-primary text-primary",
};

export const Nav = React.forwardRef<HTMLElement, NavProps>(function Nav(
  {
    items,
    variant = "default",
    dir,
    className,
    listClassName,
    itemClassName,
    activeClassName,
    renderLink,
    getIsActive,
    pathname,
    ...rest
  },
  ref
) {
  const isActive = React.useCallback(
    (item: NavItem) => {
      if (getIsActive) return getIsActive(item, pathname);
      if (item.exact) return pathname === item.href;
      if (item.href === "/") return pathname === "/";

      return pathname.startsWith(item.href);
    },
    [getIsActive, pathname]
  );

  return (
    <nav ref={ref} dir={dir} className={className} {...rest}>
      <ul className={cn(list({ variant }), listClassName)}>
        {items.map(item => {
          const active = isActive(item);
          const disabled = item.disabled;
          const classes = cn(
            linkBase,
            linkVariants[variant],
            active && activeVariants[variant],
            active && activeClassName,
            disabled && "opacity-50",
            itemClassName
          );

          const children = <Text>{item.label}</Text>;

          return (
            <li key={item.href}>
              {renderLink ? (
                renderLink({
                  href: item.href,
                  className: classes,
                  children,
                  "aria-current": active ? "page" : undefined,
                  disabled,
                })
              ) : (
                <a
                  href={item.href}
                  className={classes}
                  aria-current={active ? "page" : undefined}
                  target={item.external ? (item.target ?? "_blank") : item.target}
                  rel={item.external ? (item.rel ?? "noopener noreferrer") : item.rel}
                >
                  {children}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

Nav.displayName = "Nav";
