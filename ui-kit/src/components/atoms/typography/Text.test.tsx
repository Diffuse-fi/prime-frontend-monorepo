import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Text } from "./Text";

it("renders with chosen tag and variant classes", () => {
  render(
    <Text as="span" size="small" tone="muted" weight="semibold" className="extra">
      Hello
    </Text>
  );

  const el = screen.getByText("Hello");

  expect(el.tagName).toBe("SPAN");
  expect(el).toHaveClass("text-small", "text-muted", "font-semibold", "extra");
});
