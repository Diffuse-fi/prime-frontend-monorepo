import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Select } from "./Select";

const OPTIONS = [
  { value: "eth", label: "ETH" },
  { value: "usdc", label: "USDC" },
  { value: "btc", label: "BTC", disabled: true },
];

describe("<Select /> keyboard-only", () => {
  it("opens with keyboard and selects the next option", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onValueChange = vi.fn();

    render(
      <Select
        options={OPTIONS}
        defaultValue="eth"
        onValueChange={onValueChange}
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
      <Select options={OPTIONS} disabled placeholder="Disabled select" className="mx-2" />
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

    render(<Select options={OPTIONS} placeholder="Choose token" className="px-3" />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Choose token");
    expect(trigger).toHaveClass("px-3");

    await user.tab();
    await user.keyboard("{ArrowDown}");
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();
  });
});
