import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import { CopyButton } from "./CopyButton";

vi.mock("copy-to-clipboard", () => ({
  default: vi.fn(),
}));

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("<CopyButton />", () => {
  it("copies text and toggles icon to CopyCheck, then reverts after timeout", async () => {
    vi.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const copyMock = (await import("copy-to-clipboard")).default as Mock;

    render(<CopyButton textToCopy="hello world" aria-label="Copy" />);

    const btn = screen.getByRole("button", { name: /copy/i });

    expect(btn.querySelector(".lucide-copy")).toBeInTheDocument();
    expect(btn.querySelector(".lucide-copy-check")).not.toBeInTheDocument();

    await user.click(btn);

    expect(copyMock).toHaveBeenCalledWith("hello world");
    expect(btn.querySelector(".lucide-copy-check")).toBeInTheDocument();

    vi.advanceTimersByTime(2000);
    expect(btn.querySelector(".lucide-copy")).toBeInTheDocument();
    expect(btn.querySelector(".lucide-copy-check")).not.toBeInTheDocument();
  });

  it("calls provided onClick handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<CopyButton textToCopy="x" onClick={onClick} aria-label="Copy text" />);

    await user.click(screen.getByRole("button", { name: /copy text/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
