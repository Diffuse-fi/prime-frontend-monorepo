import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("renders label text and child input; not required by default", () => {
    render(
      <FormField label="Amount">
        <input placeholder="0.00" />
      </FormField>
    );

    expect(screen.getByText("Amount")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("0.00");
    expect(input).toBeInTheDocument();

    expect(input).not.toHaveAttribute("required");
    expect(input).not.toHaveAttribute("aria-required");

    const label = input.closest("label")!;
    expect(within(label).queryByText("*")).not.toBeInTheDocument();
  });

  it("merges className on outer label and labelClassName on text span", () => {
    render(
      <FormField label="Network" className="my-formfield" labelClassName="custom-label">
        <input />
      </FormField>
    );

    const input = screen.getByLabelText("Network");
    const label = input.closest("label")!;

    expect(label).toHaveClass("my-formfield");

    const labelTextEl = screen.getByText("Network");
    expect(labelTextEl).toHaveClass("custom-label");
  });
});
