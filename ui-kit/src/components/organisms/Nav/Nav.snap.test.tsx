import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

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
});
