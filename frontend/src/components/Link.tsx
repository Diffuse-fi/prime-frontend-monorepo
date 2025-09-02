import { localizePath, PropsWithLocale } from "@/lib/localization/locale";
import NextLink, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

type LinkPropsExtended = PropsWithLocale<
  LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
> & {
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Link({
  locale,
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
        className={`${className} opacity-60 cursor-not-allowed`}
        role="link"
      >
        {children}
      </span>
    );
  }

  return (
    <NextLink href={localizePath(String(href), locale)} className={className} {...p}>
      {children}
    </NextLink>
  );
}
