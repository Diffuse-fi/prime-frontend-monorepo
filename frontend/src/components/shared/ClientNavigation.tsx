"use client";

import { usePathname } from "next/navigation";
import Link from "./Link";
import { Nav, NavItem, NavProps } from "@diffuse/ui-kit";
import { Locale } from "next-intl";

type NavigationConfig = NavItem[];

type ClientNavigationProps = {
  config?: NavigationConfig;
  locale: Locale;
  ariaLabel: string;
  variant?: NavProps["variant"];
  className?: string;
};

export function ClientNavigation({
  config = [],
  locale,
  ariaLabel,
  variant = "default",
  className,
}: ClientNavigationProps) {
  const pathname = usePathname();

  return (
    <Nav
      className={className}
      variant={variant}
      pathname={pathname}
      aria-label={ariaLabel}
      items={config}
      renderLink={({ href, ...props }) => <Link href={href} locale={locale} {...props} />}
    />
  );
}
