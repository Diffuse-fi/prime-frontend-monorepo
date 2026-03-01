import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";

import { ControlledCollapsible, UncontrolledCollapsible } from "./Collapsible";

describe("Collapsible components", () => {
  it("controlledCollapsible: calls onOpenChange when toggled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { asFragment } = render(
      <ControlledCollapsible onOpenChange={onOpenChange} open={false} summary="More">
        <div>Body</div>
      </ControlledCollapsible>
    );

    expect(asFragment()).toMatchSnapshot();

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
