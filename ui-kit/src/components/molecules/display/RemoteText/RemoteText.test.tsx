import { render, screen } from "@testing-library/react";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RemoteText } from "./RemoteText";

vi.mock("../../../atoms", () => ({
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
    render(<RemoteText isLoading text="Loading text" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading text")).toHaveClass("invisible");
  });

  it("renders error alert and supports custom textComponent", () => {
    render(
      <RemoteText error="Failed to load" text="Strong text" textComponent="strong" />
    );
    expect(screen.getByText("Strong text", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load");
  });
});
