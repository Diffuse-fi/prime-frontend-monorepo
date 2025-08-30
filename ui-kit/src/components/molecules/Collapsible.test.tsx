import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlledCollapsible } from "./Collapsible";

vi.mock("../typography", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function getEls() {
  const details = screen.getByTestId("cc-details") as HTMLDetailsElement;
  const summary = screen.getByRole("button", { name: /./i }) || screen.getByText(/./);
  return { details, summary };
}

describe("ControlledCollapsible", () => {
  it("renders summary text", () => {
    render(
      <ControlledCollapsible
        open={false}
        summary="Section title"
        data-testid="cc-details"
      >
        <div>Body</div>
      </ControlledCollapsible>
    );

    expect(screen.getByText("Section title")).toBeInTheDocument();
  });

  it("respects the controlled `open` prop", () => {
    const { rerender } = render(
      <ControlledCollapsible open={false} summary="S" data-testid="cc-details">
        <div>Body</div>
      </ControlledCollapsible>
    );
    const { details } = getEls();
    expect(details.open).toBe(false);
    expect(screen.queryByText("Body")).not.toBeInTheDocument();

    rerender(
      <ControlledCollapsible open={true} summary="S" data-testid="cc-details">
        <div>Body</div>
      </ControlledCollapsible>
    );
    expect(details.open).toBe(true);
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("calls onOpenChange(true) when native toggle opens", async () => {
    const onOpenChange = vi.fn();
    render(
      <ControlledCollapsible
        open={false}
        onOpenChange={onOpenChange}
        summary="Open me"
        data-testid="cc-details"
      >
        <div>Body</div>
      </ControlledCollapsible>
    );

    const { details } = getEls();

    // Simulate the browser toggling: flip .open then dispatch a native 'toggle' event
    details.open = true;
    details.dispatchEvent(new Event("toggle"));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange(false) when native toggle closes", async () => {
    const onOpenChange = vi.fn();
    render(
      <ControlledCollapsible
        open={true}
        onOpenChange={onOpenChange}
        summary="Close me"
        data-testid="cc-details"
      >
        <div>Body</div>
      </ControlledCollapsible>
    );

    const { details } = getEls();
    details.open = false;
    details.dispatchEvent(new Event("toggle"));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("clicking summary triggers onOpenChange (simulated native behavior)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ControlledCollapsible
        open={false}
        onOpenChange={onOpenChange}
        summary="Click"
        data-testid="cc-details"
      >
        <div>Body</div>
      </ControlledCollapsible>
    );

    const { details, summary } = getEls();

    // JSDOM doesn't implement <details> toggling fully.
    // We simulate what the browser would do:
    await user.click(summary as HTMLElement);
    details.open = true;
    details.dispatchEvent(new Event("toggle"));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("keyboard (Enter/Space) can be handled similarly (simulation)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ControlledCollapsible
        open={false}
        onOpenChange={onOpenChange}
        summary="KB"
        data-testid="cc-details"
      >
        <div>Body</div>
      </ControlledCollapsible>
    );

    const { details } = getEls();

    await user.keyboard("{Enter}");
    // Simulate native result of pressing Enter on <summary>
    details.open = true;
    details.dispatchEvent(new Event("toggle"));

    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.keyboard(" ");
    details.open = false;
    details.dispatchEvent(new Event("toggle"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("passes through rest props to <details>", () => {
    render(
      <ControlledCollapsible
        open={false}
        summary="Props"
        id="my-details"
        className="foo bar"
        data-testid="cc-details"
        aria-label="collapsible"
      >
        <div>Body</div>
      </ControlledCollapsible>
    );

    const { details } = getEls();
    expect(details).toHaveAttribute("id", "my-details");
    expect(details).toHaveClass("foo", "bar");
    expect(details).toHaveAttribute("aria-label", "collapsible");
  });

  it("does not show children when closed; shows when open", () => {
    const { rerender } = render(
      <ControlledCollapsible open={false} summary="S" data-testid="cc-details">
        <div>Hidden body</div>
      </ControlledCollapsible>
    );
    expect(screen.queryByText("Hidden body")).not.toBeInTheDocument();

    rerender(
      <ControlledCollapsible open={true} summary="S" data-testid="cc-details">
        <div>Hidden body</div>
      </ControlledCollapsible>
    );
    expect(screen.getByText("Hidden body")).toBeInTheDocument();
  });
});
