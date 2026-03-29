import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { TooltipProvider } from "../Tooltip/Tooltip";
import { InfoIcon } from "./InfoIcon";

const renderWithProvider = (ui: React.ReactNode) =>
  render(
    <TooltipProvider delayDuration={0} disableHoverableContent skipDelayDuration={0}>
      {ui}
    </TooltipProvider>
  );

describe("<InfoIcon />", () => {
  it("renders a focusable trigger with default a11y wiring and tooltip", async () => {
    const user = userEvent.setup();
    const { asFragment } = renderWithProvider(<InfoIcon text="Details here" />);
    expect(asFragment()).toMatchSnapshot();

    const trigger = screen.getByLabelText("More info");
    expect(trigger).toHaveAttribute("tabIndex", "0");
    expect(trigger).toHaveAttribute("aria-describedby");

    await user.hover(trigger);

    await screen.findByRole("tooltip", { hidden: true });

    expect(trigger).toHaveAccessibleDescription("Details here");
  });
});
