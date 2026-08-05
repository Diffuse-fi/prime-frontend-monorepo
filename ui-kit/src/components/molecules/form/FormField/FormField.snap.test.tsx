import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { FormField } from "./FormField";

describe("<FormField />", () => {
  it("associates label text with the wrapped control", async () => {
    const { asFragment } = render(
      <FormField label="Email">
        <input aria-label="Email" type="text" />
      </FormField>
    );

    expect(asFragment()).toMatchSnapshot();
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    await userEvent.click(screen.getByText("Email"));
    expect(input).toHaveFocus();
  });
});
