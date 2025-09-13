"use client";

import { usePathname } from "@/lib/localization/navigation";
import Link from "./Link";
import { Nav, NavItem, NavProps } from "@diffuse/ui-kit";

type NavigationConfig = NavItem[];

type ClientNavigationProps = {
  config?: NavigationConfig;
  ariaLabel: string;
  variant?: NavProps["variant"];
  className?: string;
};

export function ClientNavigation({
  config = [],
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
      renderLink={({ href, ...props }) => <Link href={href} {...props} />}
    />
  );
}
