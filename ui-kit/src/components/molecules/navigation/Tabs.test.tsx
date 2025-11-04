// Tabs.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Tabs } from "./Tabs";

describe("Tabs", () => {
  it("switches content when clicking triggers and updates selected state", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Content One</Tabs.Content>
        <Tabs.Content value="two">Content Two</Tabs.Content>
      </Tabs>
    );

    const trigOne = screen.getByRole("tab", { name: "One" });
    const trigTwo = screen.getByRole("tab", { name: "Two" });
    const contentOne = screen.getByText("Content One");
    const contentTwo = screen.getByText("Content Two");

    expect(trigOne).toHaveAttribute("data-state", "active");
    expect(trigTwo).toHaveAttribute("data-state", "inactive");
    expect(contentOne).toBeVisible();
    expect(contentTwo).not.toBeVisible();

    await user.click(trigTwo);

    expect(trigTwo).toHaveAttribute("data-state", "active");
    expect(trigOne).toHaveAttribute("data-state", "inactive");
    expect(contentTwo).toBeVisible();
    expect(contentOne).not.toBeVisible();
  });

  it("renders count badge and applies fitted list layout classes", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List fitted>
          <Tabs.Trigger value="a" count={12}>
            Tab A
          </Tabs.Trigger>
          <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A</Tabs.Content>
        <Tabs.Content value="b">B</Tabs.Content>
      </Tabs>
    );

    expect(screen.getByText("12")).toBeInTheDocument();

    const list = screen.getByRole("tablist");
    expect(list.className).toContain("w-full");
    expect(list.className).toMatch(/grid|auto-cols-fr|grid-flow-col/);
  });
});
