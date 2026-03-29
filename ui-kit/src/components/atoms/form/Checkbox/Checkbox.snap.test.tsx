import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./Checkbox";

describe("<Checkbox /> keyboard & mouse behavior", () => {
  it("is reachable via keyboard (Tab) and initially unchecked", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    const { asFragment } = render(<Checkbox label="I agree to the terms" />);

    expect(asFragment()).toMatchSnapshot();

    const checkbox = screen.getByRole("checkbox", {
      name: /i agree to the terms/i,
    });

    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await user.tab();
    expect(checkbox).toHaveFocus();
  });
});
