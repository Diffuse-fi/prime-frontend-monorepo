import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { Badge } from "./Badge";

describe("<Badge />", () => {
  it("renders with defaults and shows children", () => {
    render(<Badge data-testid="badge">Active</Badge>);
    const root = screen.getByTestId("badge");
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("inline-flex", "items-center", "rounded-full");
    expect(root).toHaveClass("text-sm", "py-0.5", "gap-1.5");
    expect(root).toHaveClass("text-success");
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies size and color variants and merges className", () => {
    render(
      <Badge data-testid="badge" size="lg" color="error" className="mx-2">
        Error
      </Badge>
    );
    const root = screen.getByTestId("badge");
    expect(root).toHaveClass("mx-2");
    expect(root).toHaveClass("text-sm", "py-1", "gap-2");
    expect(root).toHaveClass("text-error");
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders without children and remains unnamed/accessibility-neutral", () => {
    render(<Badge data-testid="badge" />);
    const root = screen.getByTestId("badge");
    expect(root).toBeInTheDocument();
    expect(root).toHaveAccessibleName("");
  });
});
