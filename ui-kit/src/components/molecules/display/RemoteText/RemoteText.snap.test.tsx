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
    const { asFragment } = render(<RemoteText text="Hello" />);

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hello")).not.toHaveClass("invisible");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
