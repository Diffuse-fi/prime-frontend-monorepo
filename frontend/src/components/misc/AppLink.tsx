import { cn } from "@diffuse/ui-kit/cn";
import { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";

import { Link as IntlLink } from "@/lib/localization/navigation";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  ComponentProps<typeof IntlLink> & {
    children: ReactNode;
    disabled?: boolean;
  };

const isUrlExternal = (href: AppLinkProps["href"]) => {
  if (typeof href !== "string") return false;
  return (
    href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")
  );
};

export function AppLink({ children, className, disabled, href, ...p }: AppLinkProps) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn("cursor-not-allowed opacity-60", className)}
        inert
        role="link"
        tabIndex={-1}
      >
        {children}
      </span>
    );
  }

  if (isUrlExternal(href)) {
    return (
      <a
        className={className}
        href={typeof href === "string" ? href : undefined}
        rel="noopener noreferrer"
        target="_blank"
        {...p}
      >
        {children}
      </a>
    );
  }

  return (
    <IntlLink href={href} {...p} className={className}>
      {children}
    </IntlLink>
  );
}
