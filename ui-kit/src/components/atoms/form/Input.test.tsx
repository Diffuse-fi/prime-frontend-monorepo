import React, { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("<Input />", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Type here" />);
    const el = screen.getByPlaceholderText("Type here");

    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("type", "text");
  });

  it("forwards ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);

    ref.current!.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  it("supports uncontrolled typing (defaultValue)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input defaultValue="hi" onChange={onChange} />);
    const el = screen.getByDisplayValue("hi");

    await user.type(el, "!");
    // onChange fires for each keystroke
    expect(onChange).toHaveBeenCalled();
    expect((el as HTMLInputElement).value).toBe("hi!");
  });

  it("supports controlled value + onChange", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [v, setV] = useState("a");
      return (
        <Input value={v} onChange={e => setV(e.target.value)} placeholder="controlled" />
      );
    }

    render(<Controlled />);
    const el = screen.getByPlaceholderText("controlled") as HTMLInputElement;
    expect(el.value).toBe("a");

    await user.type(el, "bc");
    expect(el.value).toBe("abc");
  });

  it("applies size classes (sm / md / lg)", () => {
    const { rerender } = render(<Input size="sm" placeholder="sm" />);
    let el = screen.getByPlaceholderText("sm");
    expect(el).toHaveClass("h-8");
    expect(el).toHaveClass("px-2");
    expect(el).toHaveClass("text-sm");

    rerender(<Input size="md" placeholder="md" />);
    el = screen.getByPlaceholderText("md");
    expect(el).toHaveClass("h-10");
    expect(el).toHaveClass("px-3");
    expect(el).toHaveClass("text-sm");

    rerender(<Input size="lg" placeholder="lg" />);
    el = screen.getByPlaceholderText("lg");
    expect(el).toHaveClass("h-12");
    expect(el).toHaveClass("px-4");
    expect(el).toHaveClass("text-base");
  });

  it("applies error / success state classes on wrapper", () => {
    const { rerender, container } = render(<Input error placeholder="e" />);
    let wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("border-[color:var(--ui-danger)]");

    rerender(<Input success placeholder="s" />);
    wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("border-[color:var(--ui-success)]");
  });

  it("renders left and right adornments and adjusts input paddings", () => {
    render(
      <Input
        placeholder="adorned"
        left={<span data-testid="left">L</span>}
        right={<button data-testid="right">R</button>}
      />
    );
    const el = screen.getByPlaceholderText("adorned");
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();

    expect(el).toHaveClass("pl-1");
    expect(el).toHaveClass("pr-1");
  });

  it("respects disabled", () => {
    render(<Input disabled placeholder="disabled" />);
    const el = screen.getByPlaceholderText("disabled");
    expect(el).toBeDisabled();
  });

  it("accepts different input types", () => {
    render(<Input type="email" placeholder="email" />);
    const el = screen.getByPlaceholderText("email");
    expect(el).toHaveAttribute("type", "email");
  });

  it("supports asChild, passing props through Slot to child input", async () => {
    const user = userEvent.setup();

    render(
      <Input asChild placeholder="slot-placeholder">
        <input data-testid="slot-input" />
      </Input>
    );

    const el = screen.getByTestId("slot-input") as HTMLInputElement;
    expect(el).toHaveAttribute("placeholder", "slot-placeholder");
    expect(el.className).toContain("w-full");
    await user.type(el, "xyz");
    expect(el.value).toBe("xyz");
  });

  it("fires right-slot button clicks (no event swallowing)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Input
        placeholder="click"
        right={
          <button data-testid="clear" onClick={onClick}>
            Clear
          </button>
        }
      />
    );

    await user.click(screen.getByTestId("clear"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("focuses via label htmlFor (integration)", async () => {
    const user = userEvent.setup();
    render(
      <label htmlFor="nm">
        Name
        <Input id="nm" placeholder="focus via label" />
      </label>
    );

    const label = screen.getByText("Name");
    await user.click(label);
    const input = screen.getByPlaceholderText("focus via label");
    expect(document.activeElement).toBe(input);
  });
});
