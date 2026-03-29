import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { TooltipProvider } from "../Tooltip/Tooltip";
import { TextWithTooltip } from "./TextWithTooltip";

const renderWithProvider = (ui: React.ReactNode) =>
  render(
    <TooltipProvider delayDuration={0} disableHoverableContent skipDelayDuration={0}>
      {ui}
    </TooltipProvider>
  );

describe("<TextWithTooltip />", () => {
  it("renders focusable text with default aria-label and wires tooltip description", async () => {
    const user = userEvent.setup();
    const { asFragment } = renderWithProvider(
      <TextWithTooltip text="Variable APR" tooltip="APR changes each block." />
    );
    expect(asFragment()).toMatchSnapshot();

    const trigger = screen.getByLabelText("Variable APR");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("tabIndex", "0");
    expect(trigger).toHaveAttribute("aria-describedby");

    await user.hover(trigger);
    await screen.findByRole("tooltip", { hidden: true });
    expect(trigger).toHaveAccessibleDescription("APR changes each block.");
  });
});
