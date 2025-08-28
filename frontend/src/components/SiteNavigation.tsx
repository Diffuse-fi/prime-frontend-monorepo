"use client";

import { usePathname } from "next/navigation";
import Link from "./Link";

type NavigationConfig = Array<{
  title: string;
  href: string;
  disabled?: boolean;
  locale: string;
}>;

type SiteNavigationProps = {
  config?: NavigationConfig;
};

export function SiteNavigation({ config = [] }: SiteNavigationProps) {
  const pathname = usePathname();

  return (
    <ul className="flex gap-4">
      {config?.map(item => {
        const isActive = pathname.includes(item.href);

        return (
          <li key={item.href}>
            <Link
              locale={item.locale}
              disabled={item.disabled}
              href={item.href}
              className={isActive ? "font-bold" : ""}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
