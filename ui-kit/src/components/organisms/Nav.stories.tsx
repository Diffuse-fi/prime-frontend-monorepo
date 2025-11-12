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
  <Nav items={defaultItems} pathname="/" aria-label="Main navigation" />
);

export const TabsVariant: Story = () => (
  <Nav
    items={defaultItems}
    pathname="/about"
    variant="tabs"
    aria-label="Tab navigation"
  />
);

export const WithActiveItem: Story = () => (
  <div className="space-y-8">
    <div>
      <p className="text-muted mb-2 text-sm">Active: Home</p>
      <Nav items={defaultItems} pathname="/" aria-label="Navigation" />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Active: About</p>
      <Nav items={defaultItems} pathname="/about" aria-label="Navigation" />
    </div>
  </div>
);

export const WithDisabled: Story = () => (
  <Nav
    items={[
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/services", label: "Services (Coming Soon)", disabled: true },
      { href: "/contact", label: "Contact" },
    ]}
    pathname="/"
    aria-label="Main navigation"
  />
);

export const WithExternalLinks: Story = () => (
  <Nav
    items={[
      { href: "/", label: "Home" },
      {
        href: "/docs",
        label: "Docs",
        external: true,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: "/blog",
        label: "Blog",
        external: true,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      { href: "/contact", label: "Contact" },
    ]}
    pathname="/"
    aria-label="Main navigation"
  />
);

export const CustomStyling: Story = () => (
  <Nav
    items={defaultItems}
    pathname="/about"
    aria-label="Navigation"
    className="bg-fg border-border rounded-lg border p-2"
  />
);

export const Vertical: Story = () => (
  <Nav
    items={defaultItems}
    pathname="/"
    aria-label="Sidebar navigation"
    listClassName="flex-col items-start"
  />
);

export const ManyItems: Story = () => (
  <Nav
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
    aria-label="Main navigation"
    className="overflow-x-auto"
  />
);
