import { it, expect, vi, describe } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from "./RadioGroup";

describe("<RadioGroup />", () => {
  it("renders, forwards ref to root, and merges className", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref} className="root-x">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
      </RadioGroup>
    );

    const root = screen.getByRole("radiogroup");

    expect(root).toHaveClass("root-x");
    expect(ref.current).toBe(root);
  });

  it("uncontrolled: defaultValue selects item and clicking changes selection", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup defaultValue="b">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
      </RadioGroup>
    );

    const a = screen.getByRole("radio", { name: "A" });
    const b = screen.getByRole("radio", { name: "B" });

    expect(b).toHaveAttribute("aria-checked", "true");
    expect(a).toHaveAttribute("aria-checked", "false");

    await user.click(a);

    expect(a).toHaveAttribute("aria-checked", "true");
    expect(b).toHaveAttribute("aria-checked", "false");
  });

  it("controlled: calls onValueChange; disabled can not be selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup value="a" onValueChange={onValueChange}>
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
        <RadioGroup.Item value="c" disabled>
          C
        </RadioGroup.Item>
      </RadioGroup>
    );

    const a = screen.getByRole("radio", { name: "A" });
    const b = screen.getByRole("radio", { name: "B" });
    const c = screen.getByRole("radio", { name: "C" });

    expect(a).toHaveAttribute("aria-checked", "true");
    expect(b).toHaveAttribute("aria-checked", "false");
    expect(c).toHaveAttribute("aria-checked", "false");

    await user.click(b);

    expect(onValueChange).toHaveBeenCalledWith("b");

    await user.click(c);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(a).toHaveAttribute("aria-checked", "true");
    expect(b).toHaveAttribute("aria-checked", "false");
    expect(c).toHaveAttribute("aria-checked", "false");
  });
});
