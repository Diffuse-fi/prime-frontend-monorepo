import { render, screen, within } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { describe, vi } from "vitest";

import { Nav } from "./Nav";

describe("<Nav />", () => {
  it("marks items active using default logic (startsWith, exact, root) and applies activeClassName", () => {
    const { asFragment } = render(
      <Nav
        activeClassName="active-x"
        aria-label="main"
        items={[
          { href: "/", label: "Home" },
          { href: "/lend", label: "Lend" },
          { exact: true, href: "/lend/my-positions", label: "My Positions" },
        ]}
        pathname="/lend/my-positions"
      />
    );

    expect(asFragment()).toMatchSnapshot();

    const home = screen.getByRole("link", { name: "Home" });
    const lend = screen.getByRole("link", { name: "Lend" });
    const mypos = screen.getByRole("link", { name: "My Positions" });

    expect(home).not.toHaveAttribute("aria-current", "page");

    expect(lend).toHaveAttribute("aria-current", "page");
    expect(lend).toHaveClass("active-x");
    expect(mypos).toHaveAttribute("aria-current", "page");
    expect(mypos).toHaveClass("active-x");
  });

  it('marks "/" as active when pathname is exactly "/"', () => {
    render(
      <Nav
        aria-label="root"
        items={[
          { href: "/", label: "Home" },
          { href: "/lend", label: "Lend" },
        ]}
        pathname="/"
      />
    );

    const home = screen.getByRole("link", { name: "Home" });
    const lend = screen.getByRole("link", { name: "Lend" });

    expect(home).toHaveAttribute("aria-current", "page");
    expect(lend).not.toHaveAttribute("aria-current", "page");
  });

  it("uses getIsActive when provided and ignores default matching logic", () => {
    const getIsActive = vi.fn(item => item.href === "/b");

    render(
      <Nav
        aria-label="custom"
        getIsActive={getIsActive}
        items={[
          { href: "/a", label: "A" },
          { href: "/b", label: "B" },
        ]}
        pathname="/somewhere-else"
      />
    );

    const a = screen.getByRole("link", { name: "A" });
    const b = screen.getByRole("link", { name: "B" });

    expect(a).not.toHaveAttribute("aria-current", "page");
    expect(b).toHaveAttribute("aria-current", "page");
    expect(getIsActive).toHaveBeenCalled();
  });

  it('applies "tabs" variant styles to <ul> and active item', () => {
    render(
      <Nav
        aria-label="tabs"
        items={[
          { exact: true, href: "/a", label: "A" },
          { href: "/b", label: "B" },
        ]}
        pathname="/a"
        variant="tabs"
      />
    );

    const nav = screen.getByRole("navigation", { name: "tabs" });
    const list = within(nav).getByRole("list");

    expect(list).toHaveClass("text-body");

    const a = screen.getByRole("link", { name: "A" });
    expect(a).toHaveClass("border-primary");
    expect(a).toHaveClass("text-primary");

    const b = screen.getByRole("link", { name: "B" });
    expect(b).not.toHaveClass("border-primary");
    expect(b).not.toHaveAttribute("aria-current", "page");
  });

  it("renders custom link component via renderLink", () => {
    const CustomLink = ({
      customProp,
      ...rest
    }: React.ComponentPropsWithoutRef<"a"> & { customProp: string }) => {
      return <a {...rest} data-custom={customProp} />;
    };

    render(
      <Nav
        aria-label="main"
        items={[{ href: "/a", label: "A" }]}
        pathname="/a"
        renderLink={props => <CustomLink {...props} customProp="x" />}
      />
    );

    const a = screen.getByRole("link", { name: "A" });

    expect(a).toHaveAttribute("href", "/a");
    expect(a).toHaveAttribute("data-custom", "x");
    expect(a).toHaveAttribute("aria-current", "page");
  });

  it("sets target and rel correctly for external and non-external links", () => {
    render(
      <Nav
        aria-label="external"
        items={[
          {
            external: true,
            href: "https://example.com",
            label: "Ext default",
          },
          {
            external: true,
            href: "https://custom.com",
            label: "Ext custom",
            rel: "nofollow",
            target: "_self",
          },
          {
            href: "/internal",
            label: "Internal",
            rel: "noopener",
            target: "_self",
          },
        ]}
        pathname="/"
      />
    );

    const extDefault = screen.getByRole("link", { name: "Ext default" });
    const extCustom = screen.getByRole("link", { name: "Ext custom" });
    const internal = screen.getByRole("link", { name: "Internal" });

    expect(extDefault).toHaveAttribute("target", "_blank");
    expect(extDefault).toHaveAttribute("rel", "noopener noreferrer");

    expect(extCustom).toHaveAttribute("target", "_self");
    expect(extCustom).toHaveAttribute("rel", "nofollow");

    expect(internal).toHaveAttribute("target", "_self");
    expect(internal).toHaveAttribute("rel", "noopener");
  });

  it("applies disabled styles, itemClassName, listClassName and respects dir prop", () => {
    render(
      <Nav
        aria-label="dir-and-disabled"
        dir="rtl"
        itemClassName="item-x"
        items={[{ disabled: true, href: "/disabled", label: "Disabled" }]}
        listClassName="list-x"
        pathname="/disabled"
      />
    );

    const nav = screen.getByRole("navigation", { name: "dir-and-disabled" });
    expect(nav).toHaveAttribute("dir", "rtl");

    const list = within(nav).getByRole("list");
    expect(list).toHaveClass("list-x");

    const listItem = within(list).getByRole("listitem");
    expect(listItem).toHaveClass("cursor-not-allowed");

    const link = screen.getByRole("link", { name: "Disabled" });
    expect(link).toHaveClass("opacity-50");
    expect(link).toHaveClass("item-x");
  });

  it("supports empty items", () => {
    render(<Nav aria-label="empty" items={[]} pathname="/" />);

    const nav = screen.getByRole("navigation", { name: "empty" });
    const list = within(nav).getByRole("list");

    expect(list).toBeEmptyDOMElement();
  });
});
