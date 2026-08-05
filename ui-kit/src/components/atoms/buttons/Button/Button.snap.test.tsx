import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("<Button />", () => {
  it("renders, forwards ref, and handles click", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    const { asFragment } = render(
      <Button onClick={onClick} ref={ref}>
        Click me
      </Button>
    );

    expect(asFragment()).toMatchSnapshot();

    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
    expect(ref.current).toBe(btn);

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
