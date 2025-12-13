import type { Story, StoryDefault } from "@ladle/react";

import { Nav, NavItem } from "./Nav";

export default {
  title: "Organisms/Nav",
} satisfies StoryDefault;

const defaultItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export const Default: Story = () => (
  <Nav aria-label="Main navigation" items={defaultItems} pathname="/" />
);

export const TabsVariant: Story = () => (
  <Nav
    aria-label="Tab navigation"
    items={defaultItems}
    pathname="/about"
    variant="tabs"
  />
);

export const WithActiveItem: Story = () => (
  <div className="space-y-8">
    <div>
      <p className="text-muted mb-2 text-sm">Active: Home</p>
      <Nav aria-label="Navigation" items={defaultItems} pathname="/" />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Active: About</p>
      <Nav aria-label="Navigation" items={defaultItems} pathname="/about" />
    </div>
  </div>
);

export const WithDisabled: Story = () => (
  <Nav
    aria-label="Main navigation"
    items={[
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { disabled: true, href: "/services", label: "Services (Coming Soon)" },
      { href: "/contact", label: "Contact" },
    ]}
    pathname="/"
  />
);

export const WithExternalLinks: Story = () => (
  <Nav
    aria-label="Main navigation"
    items={[
      { href: "/", label: "Home" },
      {
        external: true,
        href: "/docs",
        label: "Docs",
        rel: "noopener noreferrer",
        target: "_blank",
      },
      {
        external: true,
        href: "/blog",
        label: "Blog",
        rel: "noopener noreferrer",
        target: "_blank",
      },
      { href: "/contact", label: "Contact" },
    ]}
    pathname="/"
  />
);

export const CustomStyling: Story = () => (
  <Nav
    aria-label="Navigation"
    className="bg-fg border-border rounded-lg border p-2"
    items={defaultItems}
    pathname="/about"
  />
);

export const Vertical: Story = () => (
  <Nav
    aria-label="Sidebar navigation"
    items={defaultItems}
    listClassName="flex-col items-start"
    pathname="/"
  />
);

export const ManyItems: Story = () => (
  <Nav
    aria-label="Main navigation"
    className="overflow-x-auto"
    items={[
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/markets", label: "Markets" },
      { href: "/lend", label: "Lend" },
      { href: "/borrow", label: "Borrow" },
      { href: "/stake", label: "Stake" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/analytics", label: "Analytics" },
      { href: "/settings", label: "Settings" },
    ]}
    pathname="/markets"
  />
);
