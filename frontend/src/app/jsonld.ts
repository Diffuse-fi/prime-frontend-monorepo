import { BreadcrumbList, Graph, Organization, WebPage, WebSite } from "schema-dts";

import { env } from "@/env";
import { localizedPath } from "@/lib/localization/locale";

const origin = env.ORIGIN;
const twitterAccount = env.ORG_TWITTER_ACCOUNT;
const ghAccountName = env.ORG_GITHUB_ACCOUNT;
const appName = env.NEXT_PUBLIC_APP_NAME;

const orgId = `${origin}#organization`;
const siteId = `${origin}#website`;
const logoId = `${origin}#logo`;

export const org: Organization = {
  "@id": orgId,
  "@type": "Organization",
  logo: {
    "@id": logoId,
    "@type": "ImageObject",
    caption: env.NEXT_PUBLIC_APP_NAME,
    url: `${origin}/logo.svg?v=1`,
  },
  name: env.NEXT_PUBLIC_APP_NAME,
  sameAs: [
    twitterAccount
      ? `https://twitter.com/${twitterAccount.replace(/^@/, "")}`
      : undefined,
    ghAccountName ? `https://github.com/${ghAccountName}` : undefined,
  ].filter(Boolean) as string[],
  url: origin,
};

export const site: WebSite = {
  "@id": siteId,
  "@type": "WebSite",
  name: env.NEXT_PUBLIC_APP_NAME,
  publisher: { "@id": orgId },
  url: origin,
};

type GetWebPageLdOptions = {
  description: string;
  lang: string;
  path: string;
  title: string;
};

export function getWebPageGraph({
  description,
  lang,
  path,
  title,
}: GetWebPageLdOptions): Graph {
  const trailParts = path.split("/").filter(Boolean);
  const normalizedPath = localizedPath(lang, path);
  const url = `${origin}/${normalizedPath}`;
  const webPageId = `${url}#webpage`;

  const webPage: WebPage = {
    "@id": webPageId,
    "@type": "WebPage",
    about: { "@id": orgId },
    description,
    inLanguage: lang,
    isPartOf: { "@id": siteId },
    name: title,
    publisher: { "@id": orgId },
    url,
  };

  const trail = [
    { item: origin, name: appName },
    ...trailParts.map((part, index) => ({
      item: `${origin}/${localizedPath(lang, trailParts.slice(0, index + 1).join("/"))}`,
      name: part.charAt(0).toUpperCase() + part.slice(1).replaceAll("-", " "),
    })),
  ];

  const breadcrumbs: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      item: item.item,
      name: item.name,
      position: index + 1,
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, breadcrumbs],
  };
}
