// InfoIcon.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { InfoIcon } from "./InfoIcon";

describe("<InfoIcon />", () => {
  it("renders a focusable button with aria-label, custom class and size", () => {
    render(
      <InfoIcon
        text="Tooltip text"
        className="text-red-500"
        ariaLabel="About APR"
        size={18}
        data-testid="info-icon"
      />
    );

    const trigger = screen.getByTestId("info-icon");
    expect(trigger).toHaveAttribute("role", "button");
    expect(trigger).toHaveAttribute("tabIndex", "0");
    expect(trigger).toHaveAttribute("aria-label", "About APR");
    expect(trigger).toHaveClass("text-red-500");

    const svg = trigger.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("width", "18");
    expect(svg).toHaveAttribute("height", "18");
  });

  it("shows tooltip content on hover and hides on unhover", async () => {
    const user = userEvent.setup();
    render(<InfoIcon text="APR updates every block close." ariaLabel="Aria label" />);

    const trigger = screen.getByRole("button", { name: /more info/i });

    await user.hover(trigger);
    expect(await screen.findByText("APR updates every block close.")).toBeInTheDocument();

    await user.unhover(trigger);
    expect(screen.queryByText("APR updates every block close.")).not.toBeInTheDocument();
  });
});
