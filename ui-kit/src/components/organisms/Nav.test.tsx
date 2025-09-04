import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe } from "vitest";
import { Nav } from "./Nav";

describe("<Nav />", () => {
  it("marks items active using default logic (startsWith, exact, root) and applies activeClassName", () => {
    render(
      <Nav
        aria-label="main"
        pathname="/lend/my-positions"
        activeClassName="active-x"
        items={[
          { href: "/", label: "Home" },
          { href: "/lend", label: "Lend" },
          { href: "/lend/my-positions", label: "My Positions", exact: true }, // exact
        ]}
      />
    );

    const home = screen.getByRole("link", { name: "Home" });
    const lend = screen.getByRole("link", { name: "Lend" });
    const mypos = screen.getByRole("link", { name: "My Positions" });

    expect(home).not.toHaveAttribute("aria-current", "page");
    expect(lend).toHaveAttribute("aria-current", "page");
    expect(lend).toHaveClass("active-x");
    expect(mypos).toHaveAttribute("aria-current", "page");
    expect(mypos).toHaveClass("active-x");
  });

  it('applies "tabs" variant styles to <ul> and active item', () => {
    render(
      <Nav
        aria-label="tabs"
        variant="tabs"
        pathname="/a"
        items={[
          { href: "/a", label: "A", exact: true },
          { href: "/b", label: "B" },
        ]}
      />
    );

    const nav = screen.getByRole("navigation", { name: "tabs" });
    const list = within(nav).getByRole("list");

    expect(list).toHaveClass("border-b");

    const a = screen.getByRole("link", { name: "A" });

    expect(a).toHaveClass("border-primary");
    expect(a).toHaveClass("text-primary");

    const b = screen.getByRole("link", { name: "B" });

    expect(b).not.toHaveClass("border-primary");
    expect(b).not.toHaveAttribute("aria-current", "page");
  });
});
