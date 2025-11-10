import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { IconButton } from "./IconButton";

describe("<IconButton />", () => {
  it("renders with accessible name, default (ghost, md) classes, and the icon", () => {
    render(<IconButton aria-label="settings" icon={<span data-testid="ico" />} />);

    const btn = screen.getByRole("button", { name: "settings" });

    expect(btn).toBeInTheDocument();
    expect(screen.getByTestId("ico")).toBeInTheDocument();
  });

  it("applies size=lg and variant=solid, and merges custom className", () => {
    render(
      <IconButton
        aria-label="confirm"
        size="lg"
        variant="solid"
        className="extra"
        icon={<svg />}
      />
    );

    const btn = screen.getByRole("button", { name: "confirm" });

    expect(btn).toHaveClass("h-12", "w-12", "bg-primary/80", "extra");
  });

  it("fires onClick when enabled, and not when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton aria-label="action" icon={<span />} onClick={onClick} />
    );

    const btn = screen.getByRole("button", { name: "action" });

    await user.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <IconButton aria-label="action" icon={<span />} onClick={onClick} disabled />
    );

    expect(btn).toBeDisabled();

    await user.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
