import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("<Skeleton />", () => {
  it("renders a div with base classes", () => {
    const { asFragment } = render(<Skeleton data-testid="sk" />);

    expect(asFragment()).toMatchSnapshot();
    const el = screen.getByTestId("sk");

    expect(el.tagName.toLowerCase()).toBe("div");
    expect(el).toHaveClass("animate-pulse");
  });
});
