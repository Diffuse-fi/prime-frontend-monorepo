import type { Story, StoryDefault } from "@ladle/react";

import { AssetCard } from "./AssetCard";

export default {
  title: "Molecules/Surfaces/AssetCard",
} satisfies StoryDefault;

const MockImage = ({ alt, className }: { alt: string; className: string }) => (
  <div
    className={`bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full ${className}`}
  >
    {alt.charAt(0)}
  </div>
);

export const Default: Story = () => (
  <div className="max-w-xs">
    <AssetCard renderImage={MockImage} symbol="ETH" />
  </div>
);

export const Variants: Story = () => (
  <div className="flex max-w-xs flex-col gap-4">
    <AssetCard renderImage={MockImage} symbol="ETH" variant="default" />
    <AssetCard renderImage={MockImage} symbol="USDC" variant="accented" />
  </div>
);

export const DifferentTokens: Story = () => (
  <div className="flex max-w-xs flex-col gap-4">
    <AssetCard renderImage={MockImage} symbol="ETH" />
    <AssetCard renderImage={MockImage} symbol="USDC" />
    <AssetCard renderImage={MockImage} symbol="DAI" />
    <AssetCard renderImage={MockImage} symbol="WBTC" />
  </div>
);

export const WithRealImage: Story = () => {
  const ImageWithSrc = ({ alt, className }: { alt: string; className: string }) => (
    <img
      alt={alt}
      className={`h-8 w-8 rounded-full ${className}`}
      src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
    />
  );

  return (
    <div className="max-w-xs">
      <AssetCard renderImage={ImageWithSrc} symbol="USDC" />
    </div>
  );
};

export const InGrid: Story = () => (
  <div className="grid max-w-md grid-cols-2 gap-4">
    <AssetCard renderImage={MockImage} symbol="ETH" />
    <AssetCard renderImage={MockImage} symbol="USDC" />
    <AssetCard renderImage={MockImage} symbol="DAI" />
    <AssetCard renderImage={MockImage} symbol="WBTC" />
  </div>
);
