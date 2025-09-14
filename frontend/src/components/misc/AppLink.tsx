import { Link as IntlLink } from "@/lib/localization/navigation";
import { cn } from "@diffuse/ui-kit/cn";
import { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";

type AppLinkProps = ComponentProps<typeof IntlLink> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    disabled?: boolean;
    children: ReactNode;
  };

const isUrlExternal = (url: string) => {
  return typeof url === "string" && /^(https?:)?\/\//.test(url);
};

export function AppLink({ href, children, disabled, className, ...p }: AppLinkProps) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        tabIndex={-1}
        inert
        className={cn("cursor-not-allowed opacity-60", className)}
        role="link"
      >
        {children}
      </span>
    );
  }

  if (isUrlExternal(href || "")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
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
