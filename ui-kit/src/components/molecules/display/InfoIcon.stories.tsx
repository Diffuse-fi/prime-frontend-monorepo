import type { Story, StoryDefault } from "@ladle/react";

import { InfoIcon } from "./InfoIcon";
import { TooltipProvider } from "./Tooltip";

export default {
  decorators: [
    Component => (
      <TooltipProvider>
        <Component />
      </TooltipProvider>
    ),
  ],
  title: "Molecules/Display/InfoIcon",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="flex justify-center p-20">
    <InfoIcon text="This is helpful information" />
  </div>
);

export const Sizes: Story = () => (
  <div className="flex items-center justify-center gap-4 p-20">
    <InfoIcon size={14} text="Small size" />
    <InfoIcon size={16} text="Default size (16)" />
    <InfoIcon size={20} text="Medium size" />
    <InfoIcon size={24} text="Large size" />
  </div>
);

export const Sides: Story = () => (
  <div className="flex items-center justify-center gap-8 p-20">
    <InfoIcon side="top" text="Top tooltip" />
    <InfoIcon side="right" text="Right tooltip" />
    <InfoIcon side="bottom" text="Bottom tooltip" />
    <InfoIcon side="left" text="Left tooltip" />
  </div>
);

export const LongText: Story = () => (
  <div className="flex justify-center p-20">
    <InfoIcon text="This is a much longer tooltip that contains detailed information about the feature or element it's describing. It will wrap to multiple lines when the content is too long." />
  </div>
);

export const InContext: Story = () => (
  <div className="max-w-md space-y-4 p-8">
    <div className="flex items-center gap-2">
      <span className="font-medium">APY</span>
      <InfoIcon text="Annual Percentage Yield - the rate of return on your investment over one year" />
      <span className="text-success ml-auto font-semibold">12.5%</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-medium">Health Factor</span>
      <InfoIcon text="A numeric representation of the safety of your deposited assets against the borrowed assets. Higher is safer." />
      <span className="ml-auto font-semibold">1.85</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-medium">Liquidation Threshold</span>
      <InfoIcon text="The percentage at which your loan will be eligible for liquidation" />
      <span className="ml-auto font-semibold">80%</span>
    </div>
  </div>
);

export const WithCustomColor: Story = () => (
  <div className="flex justify-center gap-4 p-20">
    <InfoIcon text="Default color" />
    <InfoIcon className="text-primary" text="Primary color" />
    <InfoIcon className="text-muted" text="Muted color" />
    <InfoIcon className="text-error" text="Error color" />
  </div>
);
