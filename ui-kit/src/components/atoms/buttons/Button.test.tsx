import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Button } from "./Button";

describe("<Button />", () => {
  it("renders, merges className, and forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="extra" aria-label="btn">
        Click
      </Button>
    );

    const btn = screen.getByRole("button", { name: "btn" });

    expect(btn).toHaveAccessibleName("btn");
    expect(btn).toHaveClass("inline-flex", "bg-primary", "text-primary-fg", "extra");
    expect(ref.current).toBe(btn);
  });

  it("applies variant=outline and size=sm classes", () => {
    render(
      <Button variant="outline" size="sm">
        Outline
      </Button>
    );

    const btn = screen.getByRole("button", { name: "Outline" });

    expect(btn).toHaveClass("bg-transparent", "border", "text-fg");
    expect(btn).toHaveClass("text-sm", "px-3", "py-1.5");
  });

  it("calls onClick when enabled, not when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Press</Button>);
    const btn = screen.getByRole("button", { name: "Press" });

    await user.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Press
      </Button>
    );

    expect(btn).toBeDisabled();

    await user.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
