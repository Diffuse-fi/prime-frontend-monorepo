"use client";

import { Nav, NavItem, NavProps } from "@diffuse/ui-kit";

import { usePathname } from "@/lib/localization/navigation";

import { AppLink } from "./AppLink";

export type ClientNavigationProps = {
  ariaLabel: string;
  className?: string;
  config?: NavigationConfig;
  variant?: NavProps["variant"];
};

export type NavigationConfig = NavItem[];

export function ClientNavigation({
  ariaLabel,
  className,
  config = [],
  variant = "default",
}: ClientNavigationProps) {
  const pathname = usePathname();

  return (
    <Nav
      aria-label={ariaLabel}
      className={className}
      items={config}
      pathname={pathname}
      renderLink={({ href, ...props }) => <AppLink href={href} {...props} />}
      variant={variant}
    />
  );
}
