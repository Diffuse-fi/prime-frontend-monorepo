import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { TokenCard, type TokenCardProps } from "./TokenCard";

vi.mock("../atoms", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe("<TokenCard />", () => {
  const renderImage: TokenCardProps["renderImage"] = ({ alt, className }) => (
    <img data-testid="token-img" alt={alt} className={className} />
  );

  it("renders the symbol text", () => {
    render(<TokenCard symbol="USDC" renderImage={renderImage} />);

    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("calls renderImage with alt and className props", () => {
    render(<TokenCard symbol="BTC" renderImage={renderImage} />);
    const img = screen.getByTestId("token-img");

    expect(img).toHaveAttribute("alt", "BTC");
    expect(img).toHaveClass(
      "h-8 w-8 flex-shrink-0 rounded-full bg-[color:var(--ui-muted)]"
    );
  });

  it("merges custom className into Card", () => {
    render(<TokenCard symbol="ETH" renderImage={renderImage} className="custom-class" />);
    const wrapper = screen.getByTestId("card");

    expect(wrapper).toHaveClass("custom-class");
    expect(wrapper).toHaveClass("flex", "items-center", "space-x-3");
  });

  it("forwards ref to underlying Card element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TokenCard symbol="USDT" renderImage={renderImage} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId("card"));
  });

  it("passes through arbitrary props", () => {
    render(
      <TokenCard
        symbol="WETH"
        renderImage={renderImage}
        data-testid="custom"
        aria-label="token"
      />
    );
    const wrapper = screen.getByTestId("custom");

    expect(wrapper).toHaveAttribute("aria-label", "token");
  });
});
