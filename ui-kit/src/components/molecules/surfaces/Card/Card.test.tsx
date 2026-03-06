import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Heading } from "@/atoms";

import { Card } from "./Card";

describe("Card", () => {
  it("renders with string header", () => {
    render(<Card header="Test Header">Body content</Card>);

    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("Test Header");
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("renders with ReactNode header", () => {
    render(<Card header={<Heading level="2">Custom Header</Heading>}>Another body</Card>);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Custom Header");
    expect(screen.getByText("Another body")).toBeInTheDocument();
  });

  it("renders without header", () => {
    render(<Card>Just body</Card>);

    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getByText("Just body")).toBeInTheDocument();
  });
});
