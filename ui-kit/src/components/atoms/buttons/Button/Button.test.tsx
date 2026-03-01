import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("<Button />", () => {
  it("renders, forwards ref, and handles click", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    const { asFragment } = render(
      <Button onClick={onClick} ref={ref}>
        Click me
      </Button>
    );

    expect(asFragment()).toMatchSnapshot();

    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
    expect(ref.current).toBe(btn);

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant/size classes and merges className", () => {
    const { rerender } = render(
      <Button className="mx-2" size="md" variant="solid">
        A
      </Button>
    );
    const first = screen.getByRole("button", { name: "A" });
    expect(first).toHaveClass("mx-2");
    const firstClass = first.getAttribute("class") ?? "";

    rerender(
      <Button className="mx-2" size="lg" variant="ghost">
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
      <Button disabled name="action" onClick={onClick}>
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
