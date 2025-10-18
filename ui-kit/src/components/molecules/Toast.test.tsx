import { it, expect, vi, describe } from "vitest";
import * as React from "react";
import { Toast } from "./Toast.js";
import { render, screen } from "@testing-library/react";

describe("<Toast />", () => {
  it("renders, forwards ref to root, and merges className", () => {
    const ref = React.createRef<HTMLLIElement>();
    render(
      <Toast ref={ref} className="root-x" open message="Message">
        Message
      </Toast>
    );

    const root = screen.getByRole("status");

    expect(root).toHaveClass("root-x");
    expect(ref.current).toBe(root);
  });

  it("renders message and title", () => {
    const { rerender } = render(<Toast open message="Message" title="Title" />);

    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();

    rerender(<Toast open message={<span>Message2</span>} />);
    expect(screen.getByText("Message2")).toBeInTheDocument();
  });

  it("closeable", () => {
    render(<Toast open message="Message" closeable />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<Toast open message="Message" closeable onClose={onClose} />);

    screen.getByRole("button").click();

    expect(onClose).toHaveBeenCalled();
  });

  it("does not render when open is false", () => {
    const { container } = render(<Toast open={false} message="Message" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("auto closes after duration", async () => {
    const onClose = vi.fn();
    vi.useFakeTimers();
    render(<Toast open message="Message" duration={1000} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(onClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
