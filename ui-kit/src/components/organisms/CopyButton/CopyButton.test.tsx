import { fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "../molecules";
import { CopyButton } from "./CopyButton";

vi.mock("lucide-react", () => ({
  CopyCheck: ({ size }: { size?: number }) => (
    <svg data-icon="check" data-testid="icon" height={size} width={size} />
  ),
  CopyIcon: ({ size }: { size?: number }) => (
    <svg data-icon="copy" data-testid="icon" height={size} width={size} />
  ),
}));

const copyMock = vi.fn();
vi.mock("copy-to-clipboard", () => ({
  default: (txt: string) => copyMock(txt),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

describe("<CopyButton />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("respects size prop for icon dimensions (sm/md/lg)", () => {
    const { rerender } = renderWithProviders(
      <CopyButton aria-label="Copy" size="sm" textToCopy="x" />
    );
    let btn = screen.getByRole("button", { name: "Copy" });
    let icon = within(btn).getByTestId("icon");
    expect(icon).toHaveAttribute("width", "16");
    expect(icon).toHaveAttribute("height", "16");

    rerender(
      <TooltipProvider>
        <CopyButton aria-label="Copy" size="md" textToCopy="x" />
      </TooltipProvider>
    );
    btn = screen.getByRole("button", { name: "Copy" });
    icon = within(btn).getByTestId("icon");
    expect(icon).toHaveAttribute("width", "20");
    expect(icon).toHaveAttribute("height", "20");

    rerender(
      <TooltipProvider>
        <CopyButton aria-label="Copy" size="lg" textToCopy="x" />
      </TooltipProvider>
    );
    btn = screen.getByRole("button", { name: "Copy" });
    icon = within(btn).getByTestId("icon");
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("clears pending timeout on unmount and supports custom aria-label", () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = renderWithProviders(
      <CopyButton aria-label="Copy text" textToCopy="x" />
    );

    const btn = screen.getByRole("button", { name: "Copy text" });
    fireEvent.click(btn);

    unmount();
    expect(clearSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
