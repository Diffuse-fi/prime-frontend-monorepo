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
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();

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
});
