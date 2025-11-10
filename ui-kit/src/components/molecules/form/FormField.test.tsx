import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { FormField } from "./FormField";

describe("<FormField />", () => {
  it("associates label text with the wrapped control", async () => {
    render(
      <FormField label="Email">
        <input type="text" aria-label="Email" />
      </FormField>
    );
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    await userEvent.click(screen.getByText("Email"));
    expect(input).toHaveFocus();
  });

  it("applies disabled state (aria-disabled and styles) on root label", () => {
    render(
      <FormField label="Amount" disabled data-testid="field">
        <input type="number" aria-label="Amount" />
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
        label="Variable APR"
        hint="APR changes each block."
        className="mt-2"
        labelClassName="text-accent"
        data-testid="field"
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
