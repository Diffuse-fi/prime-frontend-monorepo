import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Button } from "./Button";

describe("<Button />", () => {
  it("renders, forwards ref, and handles click", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Button ref={ref} onClick={onClick}>
        Click me
      </Button>
    );

    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
    expect(ref.current).toBe(btn);

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant/size classes and merges className", () => {
    const { rerender } = render(
      <Button variant="solid" size="md" className="mx-2">
        A
      </Button>
    );
    const first = screen.getByRole("button", { name: "A" });
    expect(first).toHaveClass("mx-2");
    const firstClass = first.getAttribute("class") ?? "";

    rerender(
      <Button variant="ghost" size="lg" className="mx-2">
        A
      </Button>
    );
    const second = screen.getByRole("button", { name: "A" });
    expect(second).toHaveClass("mx-2");
    const secondClass = second.getAttribute("class") ?? "";

    expect(firstClass).not.toBe(secondClass);
  });

  it("respects disabled and native props", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick} name="action">
        Do
      </Button>
    );

    const btn = screen.getByRole("button", { name: "Do" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("name", "action");

    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
