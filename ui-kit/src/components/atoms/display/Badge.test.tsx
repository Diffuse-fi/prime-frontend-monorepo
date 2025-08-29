import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("<Badge />", () => {
  it("renders pill by default with text", () => {
    render(<Badge>Pre Deposit</Badge>);

    const badge = screen.getByText("Pre Deposit");

    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("rounded-full");
  });

  it("renders dot variant with colored circle and optional text", () => {
    const { container } = render(
      <Badge variant="dot" color="success">
        Low Risk Strategies. 5.77%
      </Badge>
    );

    expect(screen.getByText("Low Risk Strategies. 5.77%")).toBeInTheDocument();
    const dot = container.querySelector(".h-2\\.5.w-2\\.5.rounded-full");
    expect(dot).toBeInTheDocument();
  });

  it("applies size and color classes (pill)", () => {
    render(
      <Badge variant="pill" size="sm" color="muted">
        Small Muted
      </Badge>
    );

    const badge = screen.getByText("Small Muted");

    expect(badge.className).toContain("text-xs");
    expect(badge.className).toContain("bg-[color:var(--ui-border)]");
  });

  it("supports asChild to render different element", () => {
    render(
      <Badge asChild>
        <a href="/foo">Go</a>
      </Badge>
    );

    const link = screen.getByRole("link", { name: "Go" });

    expect(link).toBeInTheDocument();
    expect(link.className).toMatch(/inline-flex/);
  });

  it("renders standalone dot without children", () => {
    const { container } = render(<Badge variant="dot" color="danger" />);
    const dot = container.querySelector(".h-2\\.5.w-2\\.5.rounded-full");

    expect(dot).toBeInTheDocument();
    expect(container).toHaveTextContent("");
  });
});
