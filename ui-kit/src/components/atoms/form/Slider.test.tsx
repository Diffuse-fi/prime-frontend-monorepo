import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Slider } from "./Slider";

describe("<Slider />", () => {
  it("renders and applies custom classNames to root, track, range, and thumb", () => {
    const { container } = render(
      <Slider
        className="root-x"
        trackClassName="track-x"
        rangeClassName="range-x"
        thumbClassName="thumb-x"
        defaultValue={[30]}
      />
    );

    expect(container.querySelector(".root-x")).toBeInTheDocument();
    expect(container.querySelector(".track-x")).toBeInTheDocument();
    expect(container.querySelector(".range-x")).toBeInTheDocument();
    expect(container.querySelector(".thumb-x")).toBeInTheDocument();
  });

  it("forwards ref to the underlying root element", () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { container } = render(<Slider ref={ref} defaultValue={[50]} />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(container.firstElementChild).toBe(ref.current);
  });

  it("respects props: defaultValue and disabled (accessibility & state)", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Slider ref={ref} defaultValue={[25]} disabled />);

    const thumb = screen.getByRole("slider");

    expect(thumb).toHaveAttribute("aria-valuenow", "25");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");

    expect(ref.current).toHaveAttribute("data-disabled");
  });
});
