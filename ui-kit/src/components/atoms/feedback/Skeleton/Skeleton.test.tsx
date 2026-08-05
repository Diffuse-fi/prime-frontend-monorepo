import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("<Skeleton />", () => {
  it("renders a div with base classes", () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId("sk");

    expect(el.tagName.toLowerCase()).toBe("div");
    expect(el).toHaveClass("animate-pulse");
  });

  it("applies default rounded variant (md)", () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-md");
  });

  it("applies explicit rounded variants", () => {
    const { rerender } = render(<Skeleton data-testid="sk" rounded="sm" />);
    let el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-sm");

    rerender(<Skeleton data-testid="sk" rounded="lg" />);
    el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-lg");

    rerender(<Skeleton data-testid="sk" rounded="full" />);
    el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-full");
  });

  it("merges className with generated classes", () => {
    render(<Skeleton className="custom h-4 w-8" data-testid="sk" />);
    const el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-md");
    expect(el).toHaveClass("h-4", "w-8", "custom");
  });

  it("passes through arbitrary props", () => {
    render(<Skeleton aria-label="loading" data-testattr="x" data-testid="sk" id="s1" />);
    const el = screen.getByTestId("sk");

    expect(el).toHaveAttribute("id", "s1");
    expect(el).toHaveAttribute("aria-label", "loading");
    expect(el).toHaveAttribute("data-testattr", "x");
  });

  it("forwards ref to the underlying div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton data-testid="sk" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId("sk"));
  });
});
