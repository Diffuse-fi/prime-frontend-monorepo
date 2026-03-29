import { render, screen } from "@testing-library/react";
import React from "react";
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
      "text-left"
    );
  });

  it("applies level variants", () => {
    render(
      <Heading align="center" className="extra" level="4" tone="muted">
        Hello
      </Heading>
    );

    const el = screen.getByText("Hello");

    expect(el.tagName).toBe("H4");
  });
});
