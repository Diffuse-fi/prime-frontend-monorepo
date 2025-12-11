import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Checkbox } from "./Checkbox";

describe("<Checkbox /> keyboard & mouse behavior", () => {
  it("is reachable via keyboard (Tab) and initially unchecked", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    render(<Checkbox label="I agree to the terms" />);

    const checkbox = screen.getByRole("checkbox", {
      name: /i agree to the terms/i,
    });

    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await user.tab();
    expect(checkbox).toHaveFocus();
  });

  it("calls onCheckedChange when clicked", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onCheckedChange = vi.fn();

    render(<Checkbox label="I agree to the terms" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole("checkbox", {
      name: /i agree to the terms/i,
    });

    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("respects disabled state and does not call onCheckedChange", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onCheckedChange = vi.fn();

    render(
      <Checkbox label="Disabled checkbox" disabled onCheckedChange={onCheckedChange} />
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /disabled checkbox/i,
    });

    await user.tab();
    expect(checkbox).not.toHaveFocus();

    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("clicks on the label text, renders description, and calls onCheckedChange", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        className="mx-2"
        label="I acknowledge the strategy exit process timing"
        description="The exit process may take up to 24 hours (2 hours on average)."
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /i acknowledge the strategy exit process timing/i,
    });

    expect(screen.getByText(/may take up to 24 hours/i)).toBeInTheDocument();

    await user.click(screen.getByText(/i acknowledge the strategy exit process timing/i));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });
});
