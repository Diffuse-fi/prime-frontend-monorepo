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
  return (
    <ul className="flex gap-4">
      {config?.map(item => (
        <li key={item.href}>
          <Link locale={item.locale} disabled={item.disabled} href={item.href}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
