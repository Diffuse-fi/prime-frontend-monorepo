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
});
