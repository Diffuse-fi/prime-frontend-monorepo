import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Heading } from "@/atoms";

import { Card } from "./Card";

describe("Card", () => {
  it("renders with string header", () => {
    const { asFragment } = render(<Card header="Test Header">Body content</Card>);

    expect(asFragment()).toMatchSnapshot();

    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("Test Header");
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});
