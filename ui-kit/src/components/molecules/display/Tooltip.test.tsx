import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tooltip, TooltipProvider } from "./Tooltip";
import React from "react";

describe("Tooltip", () => {
  it("renders trigger content", () => {
    render(
      <TooltipProvider>
        <Tooltip content="Hello tooltip">
          <button>Hover me</button>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});
