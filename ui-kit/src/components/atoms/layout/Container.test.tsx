import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Container } from "./Container";

it("renders children and applies base + default variant + custom classes", () => {
  render(
    <Container data-testid="container" className="custom">
      Hello
    </Container>
  );

  const el = screen.getByTestId("container");

  expect(el).toHaveTextContent("Hello");
  expect(el).toHaveClass("mx-auto", "w-full", "px-4", "sm:px-6", "lg:px-8");
  expect(el).toHaveClass("max-w-screen-xl");
  expect(el).toHaveClass("custom");
});
