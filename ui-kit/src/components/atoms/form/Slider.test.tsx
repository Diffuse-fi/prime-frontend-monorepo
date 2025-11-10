import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

vi.mock("radix-ui", () => {
  type RootProps = React.HTMLAttributes<HTMLSpanElement> & {
    value?: number[];
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (v: number[]) => void;
  };
  const Root = React.forwardRef<HTMLSpanElement, RootProps>((props, ref) => {
    const {
      value = [0],
      min = 0,
      max = 100,
      step = 1,
      disabled,
      onValueChange,
      className,
      children,
      ...rest
    } = props;
    const [val, setVal] = React.useState(value[0]);
    const onKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = e => {
      if (disabled) return;
      let next = val;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(max, val + step);
      if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        next = Math.max(min, val - step);
      if (next !== val) {
        setVal(next);
        onValueChange?.([next]);
      }
    };
    return (
      <span
        ref={ref}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={0}
        className={className}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {children}
      </span>
    );
  });
  const Track: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
    <div data-testid="track" className={className} {...p} />
  );
  const Range: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
    <div data-testid="range" className={className} {...p} />
  );
  const Thumb: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
    <div data-testid="thumb" className={className} {...p} />
  );
  return { Slider: { Root, Track, Range, Thumb } };
});

import { Slider } from "./Slider";

describe("<Slider />", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders a slider and updates value via keyboard", async () => {
    const user = userEvent.setup();
    render(
      <Slider
        aria-label="Volume"
        value={[10]}
        min={0}
        max={20}
        step={2}
        onValueChange={vi.fn()}
      />
    );

    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("aria-valuenow", "10");

    await user.click(slider);
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "12");

    await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "10");
  });

  it("applies custom classes to root, track, range, and thumb", () => {
    render(
      <section aria-label="slider-region">
        <Slider
          aria-label="Progress"
          className="root-x"
          trackClassName="track-x"
          rangeClassName="range-x"
          thumbClassName="thumb-x"
        />
      </section>
    );

    const region = screen.getByRole("region", { name: "slider-region" });
    const slider = screen.getByRole("slider", { name: "Progress" });
    expect(slider).toHaveClass("root-x");

    const track = within(region).getByTestId("track");
    const range = within(region).getByTestId("range");
    const thumb = within(region).getByTestId("thumb");

    expect(track).toHaveClass("track-x");
    expect(range).toHaveClass("range-x");
    expect(thumb).toHaveClass("thumb-x");
  });

  it("respects disabled state and blocks interactions", async () => {
    const user = userEvent.setup();
    render(<Slider aria-label="Disabled" value={[5]} disabled />);

    const slider = screen.getByRole("slider", { name: "Disabled" });
    expect(slider).toHaveAttribute("aria-disabled", "true");

    await user.click(slider);
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "5");
  });
});
