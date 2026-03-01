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
});
