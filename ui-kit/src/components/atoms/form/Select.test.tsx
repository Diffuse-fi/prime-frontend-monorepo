import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectOption } from "./Select";

const options: SelectOption[] = [
  { value: "usdc", label: "USDC" },
  { value: "usdt", label: "USDT" },
  { value: "eth", label: "ETH", disabled: true },
];

describe("<Select />", () => {
  it("opens, shows options, and calls onValueChange when selecting", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select
        options={options}
        placeholder="Choose token"
        onValueChange={onChange}
        className="w-56"
      />
    );

    expect(screen.getByText("Choose token")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    await user.click(screen.getByRole("option", { name: "USDT" }));
    expect(onChange).toHaveBeenCalledWith("usdt");
  });

  it("does not allow selecting a disabled option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Select options={options} onValueChange={onChange} />);

    await user.click(screen.getByRole("button"));
    const eth = screen.getByRole("option", { name: "ETH" });

    expect(eth).toHaveAttribute("aria-disabled", "true");

    await user.click(eth);
    expect(onChange).not.toHaveBeenCalled();
  });
});
