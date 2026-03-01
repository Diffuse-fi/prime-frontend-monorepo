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

  it("applies disabled state (aria-disabled and styles) on root label", () => {
    render(
      <FormField data-testid="field" disabled label="Amount">
        <input aria-label="Amount" type="number" />
      </FormField>
    );
    const root = screen.getByTestId("field");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(root).toHaveClass("opacity-60");
    expect(root).toHaveClass("pointer-events-none");
  });

  it("renders hint and merges class names on root and label span", () => {
    render(
      <FormField
        className="mt-2"
        data-testid="field"
        hint="APR changes each block."
        label="Variable APR"
        labelClassName="text-accent"
      >
        <input aria-label="Variable APR" />
      </FormField>
    );
    expect(screen.getByTestId("field")).toHaveClass("mt-2");
    const labelSpan = screen.getByText("Variable APR", { selector: "span" });

    expect(labelSpan).toHaveClass("text-accent");
    expect(labelSpan).toHaveClass(
      "text-accent",
      "font-mono",
      "text-xs",
      "inline-flex",
      "items-baseline",
      "gap-1"
    );
    expect(screen.getByText("APR changes each block.")).toBeInTheDocument();
  });
});
