import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { AssetInput } from "./AssetInput.jsx";

const getWrapper = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe("<AssetInput /> (with assetSymbol + default asset circle)", () => {
  it("renders input and assetSymbol text", () => {
    render(<AssetInput placeholder="amount" assetSymbol="USDC" />);

    expect(screen.getByPlaceholderText("amount")).toBeInTheDocument();
    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("renders default asset circle when renderAssetImage is not provided", () => {
    const { container } = render(<AssetInput assetSymbol="ETH" />);
    const circle = container.querySelector(".rounded-full");

    expect(circle).toBeInTheDocument();
  });

  it("renders custom asset via renderAssetImage and passes size", () => {
    const renderAssetImage = vi.fn(({ size }: { size: "sm" | "md" | "lg" }) => (
      <span data-testid="asset">{size}</span>
    ));

    render(
      <AssetInput
        assetSymbol="ARB"
        size="lg"
        renderAssetImage={renderAssetImage}
        placeholder="amt"
      />
    );

    const asset = screen.getByTestId("asset");

    expect(asset).toBeInTheDocument();
    expect(asset).toHaveTextContent("lg");
    expect(renderAssetImage).toHaveBeenCalledTimes(1);
    expect(renderAssetImage).toHaveBeenCalledWith({ size: "lg" });
    expect(screen.getByPlaceholderText("amt")).toBeInTheDocument();
  });

  it("forwards ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<AssetInput ref={ref} assetSymbol="SOL" placeholder="ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    ref.current!.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  it("propagates size changes to renderAssetImage", () => {
    const renderAssetImage = vi.fn(({ size }: { size: "sm" | "md" | "lg" }) => (
      <span data-testid="asset">{size}</span>
    ));

    const { rerender } = render(
      <AssetInput assetSymbol="BTC" size="sm" renderAssetImage={renderAssetImage} />
    );

    expect(renderAssetImage).toHaveBeenLastCalledWith({ size: "sm" });

    rerender(
      <AssetInput assetSymbol="BTC" size="md" renderAssetImage={renderAssetImage} />
    );

    expect(renderAssetImage).toHaveBeenLastCalledWith({ size: "md" });

    rerender(
      <AssetInput assetSymbol="BTC" size="lg" renderAssetImage={renderAssetImage} />
    );

    expect(renderAssetImage).toHaveBeenLastCalledWith({ size: "lg" });
  });

  it("passes common input props through (value/onValueChange, disabled, wrapperClassName)", async () => {
    const { container } = render(
      <AssetInput
        assetSymbol="USDT"
        value="1"
        disabled
        wrapperClassName="WRAPPER_CHECK"
        placeholder="p"
      />
    );

    const input = screen.getByPlaceholderText("p") as HTMLInputElement;

    expect(input.value).toBe("1.00"); // because of fixed decimalScale=2
    expect(input).toBeDisabled();

    const wrapper = getWrapper(container);

    expect(wrapper.className).toContain("WRAPPER_CHECK");
  });
});
