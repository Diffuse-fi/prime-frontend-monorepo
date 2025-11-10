import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { TextWithTooltip } from "./TextWithTooltip";
import { TooltipProvider } from "./Tooltip";

const renderWithProvider = (ui: React.ReactNode) =>
  render(
    <TooltipProvider delayDuration={0} skipDelayDuration={0} disableHoverableContent>
      {ui}
    </TooltipProvider>
  );

describe("<TextWithTooltip />", () => {
  it("renders focusable text with default aria-label and wires tooltip description", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <TextWithTooltip text="Variable APR" tooltip="APR changes each block." />
    );

    const trigger = screen.getByLabelText("Variable APR");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("tabIndex", "0");
    expect(trigger).toHaveAttribute("aria-describedby");

    await user.hover(trigger);
    await screen.findByRole("tooltip", { hidden: true });
    expect(trigger).toHaveAccessibleDescription("APR changes each block.");
  });

  it("respects custom ariaLabel, side and merges className", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <TextWithTooltip
        text="More info"
        tooltip="Detailed explanation here."
        ariaLabel="Custom label"
        className="mx-2"
        side="bottom"
      />
    );

    const trigger = screen.getByLabelText("Custom label");
    expect(trigger).toHaveClass("mx-2");

    await user.hover(trigger);
    const contentDiv = await screen.findByText("Detailed explanation here.", {
      selector: "div",
    });
    expect(contentDiv).toHaveAttribute("data-side", "bottom");
  });
});
