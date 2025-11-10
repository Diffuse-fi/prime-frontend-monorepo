import type { Story } from "@ladle/react";
import { AssetCard } from "./AssetCard";

const MockImage = ({ alt, className }: { alt: string; className: string }) => (
  <div
    className={`bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full ${className}`}
  >
    {alt.charAt(0)}
  </div>
);

export const Default: Story = () => (
  <div className="max-w-xs">
    <AssetCard symbol="ETH" renderImage={MockImage} />
  </div>
);

export const Variants: Story = () => (
  <div className="flex max-w-xs flex-col gap-4">
    <AssetCard symbol="ETH" renderImage={MockImage} variant="default" />
    <AssetCard symbol="USDC" renderImage={MockImage} variant="accented" />
  </div>
);

export const DifferentTokens: Story = () => (
  <div className="flex max-w-xs flex-col gap-4">
    <AssetCard symbol="ETH" renderImage={MockImage} />
    <AssetCard symbol="USDC" renderImage={MockImage} />
    <AssetCard symbol="DAI" renderImage={MockImage} />
    <AssetCard symbol="WBTC" renderImage={MockImage} />
  </div>
);

export const WithRealImage: Story = () => {
  const ImageWithSrc = ({ alt, className }: { alt: string; className: string }) => (
    <img
      src={`https://via.placeholder.com/32x32/41ca00/ffffff?text=${alt}`}
      alt={alt}
      className={`h-8 w-8 rounded-full ${className}`}
    />
  );

  return (
    <div className="flex max-w-xs flex-col gap-4">
      <AssetCard symbol="ETH" renderImage={ImageWithSrc} />
      <AssetCard symbol="USDC" renderImage={ImageWithSrc} />
    </div>
  );
};

export const InGrid: Story = () => (
  <div className="grid max-w-md grid-cols-2 gap-4">
    <AssetCard symbol="ETH" renderImage={MockImage} />
    <AssetCard symbol="USDC" renderImage={MockImage} />
    <AssetCard symbol="DAI" renderImage={MockImage} />
    <AssetCard symbol="WBTC" renderImage={MockImage} />
  </div>
);
