import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";
import { Heading } from "@/atoms";

describe("Card", () => {
  it("renders with string header", () => {
    render(<Card header="Test Header">Body content</Card>);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Header");
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("renders with ReactNode header", () => {
    render(<Card header={<Heading level={2}>Custom Header</Heading>}>Another body</Card>);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Custom Header");
    expect(screen.getByText("Another body")).toBeInTheDocument();
  });

  it("renders without header", () => {
    render(<Card>Just body</Card>);

    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getByText("Just body")).toBeInTheDocument();
  });
});
