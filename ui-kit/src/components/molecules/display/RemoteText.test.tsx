import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { RemoteText } from "./RemoteText";

vi.mock("../../atoms", () => ({
  Skeleton: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div role="status" {...props} />
  ),
}));

describe("<RemoteText />", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders text when not loading and no skeleton present", () => {
    render(<RemoteText text="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hello")).not.toHaveClass("invisible");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("when loading, shows skeleton and hides text visually", () => {
    render(<RemoteText text="Loading text" isLoading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading text")).toHaveClass("invisible");
  });

  it("renders error alert and supports custom textComponent", () => {
    render(
      <RemoteText text="Strong text" textComponent="strong" error="Failed to load" />
    );
    expect(screen.getByText("Strong text", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load");
  });
});
