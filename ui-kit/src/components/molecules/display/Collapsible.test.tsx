import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ControlledCollapsible, UncontrolledCollapsible } from "./Collapsible";

describe("Collapsible components", () => {
  it("controlledCollapsible: calls onOpenChange when toggled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ControlledCollapsible open={false} onOpenChange={onOpenChange} summary="More">
        <div>Body</div>
      </ControlledCollapsible>
    );

    const summary = screen.getByText("More");
    await user.click(summary);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.click(summary);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("uncontrolledCollapsible: toggles open attribute on click", async () => {
    const user = userEvent.setup();
    render(
      <UncontrolledCollapsible defaultOpen={false} summary="Details">
        <div>Content</div>
      </UncontrolledCollapsible>
    );

    const details = screen.getByRole("group");
    const toggle = screen.getByText("Details");

    expect(details).not.toHaveAttribute("open");
    await user.click(toggle);
    expect(details).toHaveAttribute("open");
    await user.click(toggle);
    expect(details).not.toHaveAttribute("open");
  });
});
