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

    const { asFragment } = render(
      <Input aria-label="Name" className="custom" onChange={onChange} ref={ref} />
    );

    expect(asFragment()).toMatchSnapshot();

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toBeInTheDocument();
    expect(ref.current).toBe(input);
    expect(input).toHaveClass("custom");

    await user.type(input, "Yuri");
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("Yuri");
  });
});
