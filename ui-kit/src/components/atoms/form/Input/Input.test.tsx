import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";

describe("<Input />", () => {
  it("renders input, forwards ref, merges className, and fires onChange", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    const onChange = vi.fn();

    render(<Input aria-label="Name" className="custom" onChange={onChange} ref={ref} />);

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toBeInTheDocument();
    expect(ref.current).toBe(input);
    expect(input).toHaveClass("custom");

    await user.type(input, "Yuri");
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("Yuri");
  });

  it("renders left and right adornments", () => {
    render(
      <Input
        aria-label="Amount"
        left={<span data-testid="left">L</span>}
        right={<span data-testid="right">R</span>}
      />
    );

    expect(screen.getByRole("textbox", { name: "Amount" })).toBeInTheDocument();
    expect(screen.getByTestId("left")).toHaveTextContent("L");
    expect(screen.getByTestId("right")).toHaveTextContent("R");
  });

  it("sets aria-invalid when error and supports disabled and type", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Secret" defaultValue="x" disabled error type="password" />);

    const input = screen.getByLabelText("Secret");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeDisabled();

    await user.type(input, "123");
    expect(input).toHaveValue("x");
  });
});
