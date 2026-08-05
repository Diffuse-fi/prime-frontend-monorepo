import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { ControlledCollapsible } from "./Collapsible";

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
});
