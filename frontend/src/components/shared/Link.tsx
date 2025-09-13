import { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";
import { Link as IntlLink } from "@/lib/localization/navigation";

type LinkPropsExtended = ComponentProps<typeof IntlLink> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    disabled?: boolean;
    children: ReactNode;
  };

export default function Link({
  href,
  disabled,
  children,
  className,
  ...p
}: LinkPropsExtended) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        tabIndex={-1}
        inert
        className={`${className} cursor-not-allowed opacity-60`}
        role="link"
      >
        {children}
      </span>
    );
  }

  return (
    <IntlLink href={href} className={className} {...p}>
      {children}
    </IntlLink>
  );
}
