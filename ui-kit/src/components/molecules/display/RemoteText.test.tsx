import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("../atoms", () => ({
  Skeleton: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));

import { RemoteText } from "./RemoteText";

describe("<RemoteText />", () => {
  it("shows skeleton overlay while loading and hides the text", () => {
    render(<RemoteText isLoading text="Hello world" />);

    const container = screen.getByRole("generic", { hidden: true }) as HTMLElement;
    expect(container).toHaveAttribute("aria-busy", "true");
    expect(container).toHaveStyle({ width: "12ch" });

    const text = screen.getByText("Hello world");
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass("invisible");

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("shows error message and skips the skeleton", () => {
    render(
      <RemoteText
        text="Will be ignored due to error"
        error="Something went wrong"
        isLoading={true}
      />
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Something went wrong");

    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();

    const container = alert.closest("div") as HTMLElement;
    expect(container).not.toHaveAttribute("aria-busy");
  });
});
