import { describe, it, expect } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("<Skeleton />", () => {
  it("renders a div with base classes", () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId("sk");

    expect(el.tagName.toLowerCase()).toBe("div");
    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveClass("bg-[color:var(--ui-muted)]");
  });

  it("applies default rounded variant (md)", () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-md");
  });

  it("applies explicit rounded variants", () => {
    const { rerender } = render(<Skeleton rounded="sm" data-testid="sk" />);
    let el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-sm");

    rerender(<Skeleton rounded="lg" data-testid="sk" />);
    el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-lg");

    rerender(<Skeleton rounded="full" data-testid="sk" />);
    el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-full");
  });

  it("merges className with generated classes", () => {
    render(<Skeleton className="h-4 w-8 custom" data-testid="sk" />);
    const el = screen.getByTestId("sk");

    expect(el).toHaveClass("rounded-md");
    expect(el).toHaveClass("h-4", "w-8", "custom");
  });

  it("passes through arbitrary props", () => {
    render(<Skeleton id="s1" aria-label="loading" data-testattr="x" data-testid="sk" />);
    const el = screen.getByTestId("sk");

    expect(el).toHaveAttribute("id", "s1");
    expect(el).toHaveAttribute("aria-label", "loading");
    expect(el).toHaveAttribute("data-testattr", "x");
  });

  it("forwards ref to the underlying div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} data-testid="sk" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId("sk"));
  });
});
