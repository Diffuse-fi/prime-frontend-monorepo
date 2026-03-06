import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

import { IconButton } from "./IconButton";

describe("<IconButton />", () => {
  it("renders with accessible name, default (ghost, md) classes, and the icon", () => {
    const { asFragment } = render(
      <IconButton aria-label="settings" icon={<span data-testid="ico" />} />
    );

    expect(asFragment()).toMatchSnapshot();

    const btn = screen.getByRole("button", { name: "settings" });

    expect(btn).toBeInTheDocument();
    expect(screen.getByTestId("ico")).toBeInTheDocument();
  });
});
