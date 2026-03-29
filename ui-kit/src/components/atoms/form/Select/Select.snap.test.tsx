import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

const OPTIONS = [
  { label: "ETH", value: "eth" },
  { label: "USDC", value: "usdc" },
  { disabled: true, label: "BTC", value: "btc" },
];

describe("<Select /> keyboard-only", () => {
  it("opens with keyboard and selects the next option", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onValueChange = vi.fn();

    const { asFragment } = render(
      <Select
        defaultValue="eth"
        onValueChange={onValueChange}
        options={OPTIONS}
        placeholder="Pick token"
      />
    );

    expect(asFragment()).toMatchSnapshot();

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("ETH");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.tab();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("listbox");

    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("usdc");
    expect(trigger).toHaveTextContent("USDC");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
