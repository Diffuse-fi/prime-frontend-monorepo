import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { describe, expect, it } from "vitest";

import { Dialog } from "./Dialog";

describe("<Dialog />", () => {
  it("renders open dialog with title, description, children and applies size variant", () => {
    const { asFragment } = render(
      <Dialog description="Desc" open size="sm" title="Title">
        <div>Body</div>
      </Dialog>
    );

    expect(asFragment()).toMatchSnapshot();

    const dlg = screen.getByRole("dialog");
    expect(dlg).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();

    expect(dlg).toHaveClass("fixed z-100");
  });
});
