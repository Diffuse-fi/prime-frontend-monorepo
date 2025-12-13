import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { AssetCard, type AssetCardProps } from "./AssetCard";

describe("<AssetCard />", () => {
  const renderImage: AssetCardProps["renderImage"] = ({ alt, className }) => (
    <img alt={alt} className={className} data-testid="token-img" />
  );

  it("renders the symbol text", () => {
    render(<AssetCard renderImage={renderImage} symbol="USDC" />);

    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("calls renderImage with alt and className props", () => {
    render(
      <AssetCard
        renderImage={() => renderImage({ alt: "BTC", className: "x-class" })}
        symbol="BTC"
      />
    );
    const img = screen.getByTestId("token-img");

    expect(img).toHaveAttribute("alt", "BTC");
    expect(img).toHaveClass("x-class");
  });

  it("merges custom className into Card", () => {
    render(
      <AssetCard
        className="custom-class"
        data-testid="card"
        renderImage={renderImage}
        symbol="ETH"
      />
    );
    const wrapper = screen.getByTestId("card");

    expect(wrapper).toHaveClass("custom-class");
  });

  it("forwards ref to underlying Card element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AssetCard data-testid="card" ref={ref} renderImage={renderImage} symbol="USDT" />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId("card"));
  });

  it("passes through arbitrary props", () => {
    render(
      <AssetCard
        aria-label="token"
        data-testid="custom"
        renderImage={renderImage}
        symbol="WETH"
      />
    );
    const wrapper = screen.getByTestId("custom");

    expect(wrapper).toHaveAttribute("aria-label", "token");
  });
});
