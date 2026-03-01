import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ButtonLike } from "./ButtonLike";

describe("ButtonLike", () => {
  it("renders a <button> by default, merges classes, and exposes aria-label", () => {
    const { asFragment } = render(
      <ButtonLike
        aria-label="Save changes"
        className="custom-class"
        icon
        size="md"
        variant="solid"
      >
        Save
      </ButtonLike>
    );

    expect(asFragment()).toMatchSnapshot();

    const btn = screen.getByRole("button", { name: /save changes/i });

    expect(btn.tagName).toBe("BUTTON");
    expect(btn.className).toContain("inline-flex");
    expect(btn.className).toContain("custom-class");
    expect(btn).toHaveTextContent("Save");
  });

  it("renders as an <a> when component='a' and forwards anchor props", () => {
    render(
      <ButtonLike
        aria-label="Open in explorer"
        component="a"
        href="/vaults/0x123"
        icon
        rel="noopener noreferrer"
        size="sm"
        target="_blank"
        variant="ghost"
      >
        <span aria-hidden="true">↗︎</span>
      </ButtonLike>
    );

    const link = screen.getByRole("link", { name: /open in explorer/i });

    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/vaults/0x123");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.className).toContain("inline-flex");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
