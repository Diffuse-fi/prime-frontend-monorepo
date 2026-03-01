import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import { Heading } from "./Heading";

describe("<Heading />", () => {
  it("renders defaults: h2 with base + default variant classes", () => {
    const { asFragment } = render(<Heading>Title</Heading>);

    expect(asFragment()).toMatchSnapshot();

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
});
