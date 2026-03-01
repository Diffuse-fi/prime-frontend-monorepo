import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("radix-ui", () => {
  type RootProps = React.HTMLAttributes<HTMLSpanElement> & {
    disabled?: boolean;
    max?: number;
    min?: number;
    onValueChange?: (v: number[]) => void;
    step?: number;
    value?: number[];
  };
  const Root = React.forwardRef<HTMLSpanElement, RootProps>((props, ref) => {
    const {
      children,
      className,
      disabled,
      max = 100,
      min = 0,
      onValueChange,
      step = 1,
      value = [0],
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
        aria-disabled={disabled ? "true" : undefined}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={val}
        className={className}
        onKeyDown={onKeyDown}
        ref={ref}
        role="slider"
        tabIndex={0}
        {...rest}
      >
        {children}
      </span>
    );
  });
  const Track: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
    <div className={className} data-testid="track" {...p} />
  );
  const Range: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
    <div className={className} data-testid="range" {...p} />
  );
  const Thumb: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
    <div className={className} data-testid="thumb" {...p} />
  );
  return { Slider: { Range, Root, Thumb, Track } };
});

import { Slider } from "./Slider";

describe("<Slider />", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders a slider and updates value via keyboard", async () => {
    const user = userEvent.setup();
    const { asFragment } = render(
      <Slider
        aria-label="Volume"
        max={20}
        min={0}
        onValueChange={vi.fn()}
        step={2}
        value={[10]}
      />
    );

    expect(asFragment()).toMatchSnapshot();

    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("aria-valuenow", "10");

    await user.click(slider);
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "12");

    await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "10");
  });
});
