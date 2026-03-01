import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Tabs } from "./Tabs";

function setup(ui?: React.ReactNode) {
  return render(
    ui ?? (
      <Tabs defaultValue="one">
        <Tabs.List aria-label="Demo tabs">
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Panel One</Tabs.Content>
        <Tabs.Content value="two">Panel Two</Tabs.Content>
      </Tabs>
    )
  );
}

describe("<Tabs />", () => {
  it("renders tablist, tabs, and shows the selected tabpanel", async () => {
    setup();

    const list = screen.getByRole("tablist", { name: /demo tabs/i });
    expect(list).toBeInTheDocument();

    const tabOne = screen.getByRole("tab", { name: "One", selected: true });
    const tabTwo = screen.getByRole("tab", { name: "Two", selected: false });
    expect(tabOne).toBeInTheDocument();
    expect(tabTwo).toBeInTheDocument();

    const panelOne = screen.getByRole("tabpanel", { name: "One" });
    expect(panelOne).toHaveTextContent("Panel One");
    expect(screen.queryByRole("tabpanel", { name: "Two" })).not.toBeInTheDocument();

    await userEvent.click(tabTwo);
    const panelTwo = await screen.findByRole("tabpanel", { name: "Two" });
    expect(panelTwo).toHaveTextContent("Panel Two");
    expect(screen.queryByRole("tabpanel", { name: "One" })).not.toBeInTheDocument();
  });

  it("applies visual variants: List align+fitted, Trigger fitted, Content inset", async () => {
    setup(
      <Tabs defaultValue="a">
        <Tabs.List align="between" aria-label="Variants" fitted>
          <Tabs.Trigger fitted value="a">
            A
          </Tabs.Trigger>
          <Tabs.Trigger fitted value="b">
            B
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content inset value="a">
          Pa
        </Tabs.Content>
        <Tabs.Content inset value="b">
          Pb
        </Tabs.Content>
      </Tabs>
    );

    const list = screen.getByRole("tablist", { name: /variants/i });
    expect(list).toHaveClass("justify-between", "w-full");
    expect(list).toHaveClass("grid", "auto-cols-fr", "grid-flow-col");

    const tabA = screen.getByRole("tab", { name: "A" });
    const tabB = screen.getByRole("tab", { name: "B" });
    expect(tabA).toHaveClass("justify-center", "w-full");
    expect(tabB).toHaveClass("justify-center", "w-full");

    const panelA = screen.getByRole("tabpanel", { name: "A" });
    expect(panelA).toHaveClass("pt-3");
    expect(panelA).toHaveClass("mt-2");
  });

  it("renders left/right slots and count badge on trigger", async () => {
    setup(
      <Tabs defaultValue="x">
        <Tabs.List aria-label="Extras">
          <Tabs.Trigger
            count={3}
            left={<span>🔹</span>}
            right={<span>ℹ️</span>}
            value="x"
          >
            X tab
          </Tabs.Trigger>
          <Tabs.Trigger value="y">Y tab</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="x">Px</Tabs.Content>
        <Tabs.Content value="y">Py</Tabs.Content>
      </Tabs>
    );

    const tabX = screen.getByRole("tab", { name: /x tab/i });
    expect(tabX).toBeInTheDocument();

    const leftIcon = screen.getByText("🔹");
    const rightIcon = screen.getByText("ℹ️");
    const countBadge = screen.getByText("3");

    expect(leftIcon).toBeInTheDocument();
    expect(rightIcon).toBeInTheDocument();
    expect(countBadge).toBeInTheDocument();
    expect(countBadge).toHaveClass("rounded-full");
  });
});
