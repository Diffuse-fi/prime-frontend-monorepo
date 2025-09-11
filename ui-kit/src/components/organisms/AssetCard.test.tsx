import { describe, it, expect } from "vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AssetCard, type AssetCardProps } from "./AssetCard";

describe("<AssetCard />", () => {
  const renderImage: AssetCardProps["renderImage"] = ({ alt, className }) => (
    <img data-testid="token-img" alt={alt} className={className} />
  );

  it("renders the symbol text", () => {
    render(<AssetCard symbol="USDC" renderImage={renderImage} />);

    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("calls renderImage with alt and className props", () => {
    render(
      <AssetCard
        symbol="BTC"
        renderImage={() => renderImage({ className: "x-class", alt: "BTC" })}
      />
    );
    const img = screen.getByTestId("token-img");

    expect(img).toHaveAttribute("alt", "BTC");
    expect(img).toHaveClass("x-class");
  });

  it("merges custom className into Card", () => {
    render(
      <AssetCard
        symbol="ETH"
        renderImage={renderImage}
        className="custom-class"
        data-testid="card"
      />
    );
    const wrapper = screen.getByTestId("card");

    expect(wrapper).toHaveClass("custom-class");
  });

  it("forwards ref to underlying Card element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AssetCard symbol="USDT" renderImage={renderImage} ref={ref} data-testid="card" />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId("card"));
  });

  it("passes through arbitrary props", () => {
    render(
      <AssetCard
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
