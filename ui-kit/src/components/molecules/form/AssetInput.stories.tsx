import type { Story } from "@ladle/react";
import { AssetInput } from "./AssetInput";
import { useState } from "react";

const MockAssetImage = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
  return (
    <div
      className={`${sizeClass} bg-primary/20 flex items-center justify-center rounded-full text-xs`}
    >
      E
    </div>
  );
};

export const Default: Story = () => (
  <div className="max-w-md">
    <AssetInput assetSymbol="ETH" placeholder="0.00" />
  </div>
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("1234.56");
  return (
    <div className="max-w-md space-y-4">
      <AssetInput
        assetSymbol="ETH"
        value={value}
        onValueChange={values => setValue(values.value)}
      />
      <p className="text-muted text-sm">Value: {value}</p>
    </div>
  );
};

export const WithImage: Story = () => (
  <div className="max-w-md">
    <AssetInput assetSymbol="ETH" renderAssetImage={MockAssetImage} placeholder="0.00" />
  </div>
);

export const Sizes: Story = () => (
  <div className="max-w-md space-y-4">
    <AssetInput size="sm" assetSymbol="ETH" placeholder="0.00" />
    <AssetInput size="md" assetSymbol="ETH" placeholder="0.00" />
    <AssetInput size="lg" assetSymbol="ETH" placeholder="0.00" />
  </div>
);

export const DifferentAssets: Story = () => (
  <div className="max-w-md space-y-4">
    <AssetInput assetSymbol="ETH" placeholder="0.00" />
    <AssetInput assetSymbol="USDC" placeholder="0.00" />
    <AssetInput assetSymbol="DAI" placeholder="0.00" />
    <AssetInput assetSymbol="WBTC" placeholder="0.00" />
  </div>
);

export const States: Story = () => (
  <div className="max-w-md space-y-4">
    <div>
      <p className="text-muted mb-2 text-sm">Default</p>
      <AssetInput assetSymbol="ETH" placeholder="0.00" />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Error</p>
      <AssetInput assetSymbol="ETH" placeholder="0.00" error />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Disabled</p>
      <AssetInput assetSymbol="ETH" placeholder="0.00" disabled />
    </div>
  </div>
);

export const WithLabel: Story = () => (
  <div className="max-w-md space-y-4">
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium">Amount</label>
        <span className="text-muted text-sm">Balance: 1,234.56</span>
      </div>
      <AssetInput assetSymbol="ETH" placeholder="0.00" />
    </div>
  </div>
);

export const LargeNumbers: Story = () => {
  const [value, setValue] = useState("1234567.89");
  return (
    <div className="max-w-md space-y-4">
      <AssetInput
        assetSymbol="ETH"
        value={value}
        onValueChange={values => setValue(values.value)}
      />
      <p className="text-muted text-sm">Formatted: {value}</p>
    </div>
  );
};
