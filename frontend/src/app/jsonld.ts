import { env } from "@/env";
import { localizedPath } from "@/lib/localization/locale";
import { BreadcrumbList, Graph, Organization, WebPage, WebSite } from "schema-dts";

const origin = env.ORIGIN;
const twitterAccount = env.ORG_TWITTER_ACCOUNT;
const ghAccountName = env.ORG_GITHUB_ACCOUNT;
const appName = env.NEXT_PUBLIC_APP_NAME;

const orgId = `${origin}#organization`;
const siteId = `${origin}#website`;
const logoId = `${origin}#logo`;

export const org: Organization = {
  "@type": "Organization",
  "@id": orgId,
  name: env.NEXT_PUBLIC_APP_NAME,
  url: origin,
  logo: {
    "@type": "ImageObject",
    "@id": logoId,
    url: `${origin}/logo.svg?v=1`,
    caption: env.NEXT_PUBLIC_APP_NAME,
  },
  sameAs: [
    twitterAccount
      ? `https://twitter.com/${twitterAccount.replace(/^@/, "")}`
      : undefined,
    ghAccountName ? `https://github.com/${ghAccountName}` : undefined,
  ].filter(Boolean) as string[],
};

export const site: WebSite = {
  "@type": "WebSite",
  "@id": siteId,
  url: origin,
  name: env.NEXT_PUBLIC_APP_NAME,
  publisher: { "@id": orgId },
};

type GetWebPageLdOptions = {
  title: string;
  description: string;
  path: string;
  lang: string;
};

export function getWebPageGrapth({
  lang,
  description,
  title,
  path,
}: GetWebPageLdOptions): Graph {
  const trailParts = path.split("/").filter(Boolean);
  const normalizedPath = localizedPath(lang, path);
  const url = `${origin}/${normalizedPath}`;
  const webPageId = `${url}#webpage`;

  const webPage: WebPage = {
    "@type": "WebPage",
    "@id": webPageId,
    url,
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { "@id": siteId },
    about: { "@id": orgId },
    publisher: { "@id": orgId },
  };

  const trail = [
    { name: appName, item: origin },
    ...trailParts.map((part, index) => ({
      name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
      item: `${origin}/${localizedPath(lang, trailParts.slice(0, index + 1).join("/"))}`,
    })),
  ];

  const breadcrumbs: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, breadcrumbs],
  };
}
