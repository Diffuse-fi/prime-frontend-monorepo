import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Toast } from "./Toast";

describe("<Toast />", () => {
  it("renders, forwards ref to root, and merges className", () => {
    const ref = React.createRef<HTMLLIElement>();
    const { asFragment } = render(
      <Toast className="root-x" message="Message" open ref={ref}>
        Message
      </Toast>
    );

    expect(asFragment()).toMatchSnapshot();

    const root = screen.getByRole("status");
    expect(root).toHaveClass("root-x");
    expect(ref.current).toBe(root);
  });

  it("renders message and title", () => {
    const { rerender } = render(<Toast message="Message" open title="Title" />);
    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();

    rerender(<Toast message={<span>Message2</span>} open />);
    expect(screen.getByText("Message2")).toBeInTheDocument();
  });

  it("closeable", () => {
    render(<Toast closeable message="Message" open />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Toast closeable message="Message" onClose={onClose} open />);

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render when open is false", () => {
    render(<Toast message="Message" open={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("auto closes after duration", async () => {
    const onClose = vi.fn();
    vi.useFakeTimers();
    render(<Toast duration={1000} message="Message" onClose={onClose} open />);

    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
