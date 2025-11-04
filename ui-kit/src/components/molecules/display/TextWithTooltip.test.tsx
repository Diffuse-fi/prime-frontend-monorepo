import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { TextWithTooltip } from "./TextWithTooltip";

describe("<TextWithTooltip />", () => {
  it("renders a focusable trigger with proper a11y wiring (aria-label & aria-describedby -> role=tooltip)", async () => {
    render(<TextWithTooltip text="Variable APR" tooltip="APR changes each block." />);

    const trigger = screen.getByText("Variable APR");

    expect(trigger.tagName).toBe("SPAN");
    expect(trigger).toHaveAttribute("tabIndex", "0");
    expect(trigger).toHaveAttribute("aria-label", "Variable APR");

    await userEvent.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("APR changes each block.");

    const describedBy = trigger.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(tooltip.getAttribute("id")).toBe(describedBy);
  });

  it("opens on focus/hover and closes on Escape/blur", async () => {
    const user = userEvent.setup();
    render(<TextWithTooltip text="More details" tooltip="Detailed explanation here." />);

    const trigger = screen.getByText("More details");

    await user.hover(trigger);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Detailed explanation here."
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.tab();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    trigger.blur();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
