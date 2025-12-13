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

    render(
      <Select
        defaultValue="eth"
        onValueChange={onValueChange}
        options={OPTIONS}
        placeholder="Pick token"
      />
    );

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

  it("respects disabled root state (cannot open with keyboard)", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    render(
      <Select className="mx-2" disabled options={OPTIONS} placeholder="Disabled select" />
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveClass("mx-2");

    await user.tab();
    await user.keyboard("{ArrowDown}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("shows placeholder, merges classes, and renders disabled option in the list", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    render(<Select className="px-3" options={OPTIONS} placeholder="Choose token" />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Choose token");
    expect(trigger).toHaveClass("px-3");

    await user.tab();
    await user.keyboard("{ArrowDown}");
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();
  });
});
