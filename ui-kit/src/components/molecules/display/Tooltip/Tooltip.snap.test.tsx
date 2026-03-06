import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Tooltip, TooltipProvider } from "./Tooltip";

describe("Tooltip", () => {
  it("renders trigger content", () => {
    const { asFragment } = render(
      <TooltipProvider>
        <Tooltip content="Hello tooltip">
          <button>Hover me</button>
        </Tooltip>
      </TooltipProvider>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});
