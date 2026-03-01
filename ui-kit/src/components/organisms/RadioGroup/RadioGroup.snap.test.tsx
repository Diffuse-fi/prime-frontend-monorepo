import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "./RadioGroup";

describe("<RadioGroup />", () => {
  it("renders, forwards ref to root, and merges className", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { asFragment } = render(
      <RadioGroup className="root-x" ref={ref}>
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
      </RadioGroup>
    );

    expect(asFragment()).toMatchSnapshot();

    const root = screen.getByRole("radiogroup");

    expect(root).toHaveClass("root-x");
    expect(ref.current).toBe(root);
  });
});
