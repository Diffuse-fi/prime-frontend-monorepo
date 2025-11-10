import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";

vi.mock("lucide-react", () => ({
  CopyCheck: ({ size }: { size?: number }) => (
    <svg data-testid="icon" data-icon="check" width={size} height={size} />
  ),
  CopyIcon: ({ size }: { size?: number }) => (
    <svg data-testid="icon" data-icon="copy" width={size} height={size} />
  ),
}));

const copyMock = vi.fn();
vi.mock("copy-to-clipboard", () => ({
  default: (txt: string) => copyMock(txt),
}));

import { CopyButton } from "./CopyButton";

describe("<CopyButton />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("respects size prop for icon dimensions (sm/md/lg)", () => {
    const { rerender } = render(
      <CopyButton textToCopy="x" size="sm" aria-label="Copy" />
    );
    let btn = screen.getByRole("button", { name: "Copy" });
    let icon = within(btn).getByTestId("icon");
    expect(icon).toHaveAttribute("width", "16");
    expect(icon).toHaveAttribute("height", "16");

    rerender(<CopyButton textToCopy="x" size="md" aria-label="Copy" />);
    btn = screen.getByRole("button", { name: "Copy" });
    icon = within(btn).getByTestId("icon");
    expect(icon).toHaveAttribute("width", "20");
    expect(icon).toHaveAttribute("height", "20");

    rerender(<CopyButton textToCopy="x" size="lg" aria-label="Copy" />);
    btn = screen.getByRole("button", { name: "Copy" });
    icon = within(btn).getByTestId("icon");
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("clears pending timeout on unmount and supports custom aria-label", () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = render(<CopyButton textToCopy="x" aria-label="Copy text" />);

    const btn = screen.getByRole("button", { name: "Copy text" });
    fireEvent.click(btn);

    unmount();
    expect(clearSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
