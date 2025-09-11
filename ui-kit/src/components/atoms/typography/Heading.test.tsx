import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Heading } from "./Heading";

describe("<Heading />", () => {
  it("renders defaults: h2 with base + default variant classes", () => {
    render(<Heading>Title</Heading>);

    const el = screen.getByText("Title");

    expect(el.tagName).toBe("H2");
    expect(el).toHaveClass(
      "font-semibold",
      "tracking-tight",
      "text-balance",
      "text-h2",
      "text-left",
      "text-text-primary"
    );
  });

  it("applies level variants", () => {
    render(
      <Heading level="4" align="center" tone="muted" className="extra">
        Hello
      </Heading>
    );

    const el = screen.getByText("Hello");

    expect(el.tagName).toBe("H4");
  });
});
