import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("<Badge />", () => {
  it("renders with defaults and shows children", () => {
    const { asFragment } = render(<Badge data-testid="badge">Active</Badge>);

    expect(asFragment()).toMatchSnapshot();
    const root = screen.getByTestId("badge");
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("inline-flex", "items-center", "rounded-full");
    expect(root).toHaveClass("text-sm", "py-0.5", "gap-1.5");
    expect(root).toHaveClass("text-success");
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
