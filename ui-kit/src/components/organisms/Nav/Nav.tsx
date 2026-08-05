import * as React from "react";

import { cn, tv } from "@/lib";

export interface NavItem {
  disabled?: boolean;
  exact?: boolean;
  external?: boolean;
  href: string;
  label: string;
  rel?: string;
  target?: string;
}

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  activeClassName?: string;
  "aria-label": string;
  dir?: "ltr" | "rtl";
  getIsActive?: (item: NavItem, pathname: string) => boolean;
  itemClassName?: string;
  items: NavItem[];
  listClassName?: string;
  pathname: string;
  renderLink?: (props: {
    "aria-current"?: "page";
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    href: string;
  }) => React.ReactElement;
  variant?: NavVariant;
}

export type NavVariant = "default" | "tabs";

const list = tv({
  base: "flex items-center gap-2",
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "text-subtle",
      tabs: "text-body",
    },
  },
});

const linkBase =
  "inline-flex items-center gap-2 px-3 py-2 font-medium transition-colors standard-focus-ring";

const linkVariants: Record<NavVariant, string> = {
  default: "rounded-md text-foreground/80 hover:text-primary",
  tabs: "rounded-none -mb-px border-b-2 border-transparent text-text-dimmed hover:text-primary",
};

const activeVariants: Record<NavVariant, string> = {
  default: "text-primary font-bold",
  tabs: "border-primary text-primary",
};

export const Nav = React.forwardRef<HTMLElement, NavProps>(function Nav(
  {
    activeClassName,
    className,
    dir,
    getIsActive,
    itemClassName,
    items,
    listClassName,
    pathname,
    renderLink,
    variant = "default",
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
    <nav className={className} dir={dir} ref={ref} {...rest}>
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

          const children = <p>{item.label}</p>;

          return (
            <li className={cn(disabled && "cursor-not-allowed")} key={item.href}>
              {renderLink ? (
                renderLink({
                  "aria-current": active ? "page" : undefined,
                  children,
                  className: classes,
                  disabled,
                  href: item.href,
                })
              ) : (
                <a
                  aria-current={active ? "page" : undefined}
                  className={classes}
                  href={item.href}
                  rel={item.external ? (item.rel ?? "noopener noreferrer") : item.rel}
                  target={item.external ? (item.target ?? "_blank") : item.target}
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
