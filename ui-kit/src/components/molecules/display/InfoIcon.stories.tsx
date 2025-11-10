import type { Story } from "@ladle/react";
import { InfoIcon } from "./InfoIcon";
import { TooltipProvider } from "./Tooltip";

export const Default: Story = () => (
  <TooltipProvider>
    <div className="p-20 flex justify-center">
      <InfoIcon text="This is helpful information" />
    </div>
  </TooltipProvider>
);

export const Sizes: Story = () => (
  <TooltipProvider>
    <div className="p-20 flex gap-4 items-center justify-center">
      <InfoIcon text="Small size" size={14} />
      <InfoIcon text="Default size (16)" size={16} />
      <InfoIcon text="Medium size" size={20} />
      <InfoIcon text="Large size" size={24} />
    </div>
  </TooltipProvider>
);

export const Sides: Story = () => (
  <TooltipProvider>
    <div className="p-20 flex gap-8 justify-center items-center">
      <InfoIcon text="Top tooltip" side="top" />
      <InfoIcon text="Right tooltip" side="right" />
      <InfoIcon text="Bottom tooltip" side="bottom" />
      <InfoIcon text="Left tooltip" side="left" />
    </div>
  </TooltipProvider>
);

export const LongText: Story = () => (
  <TooltipProvider>
    <div className="p-20 flex justify-center">
      <InfoIcon text="This is a much longer tooltip that contains detailed information about the feature or element it's describing. It will wrap to multiple lines when the content is too long." />
    </div>
  </TooltipProvider>
);

export const InContext: Story = () => (
  <TooltipProvider>
    <div className="p-8 space-y-4 max-w-md">
      <div className="flex items-center gap-2">
        <span className="font-medium">APY</span>
        <InfoIcon text="Annual Percentage Yield - the rate of return on your investment over one year" />
        <span className="ml-auto text-success font-semibold">12.5%</span>
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
  </TooltipProvider>
);

export const WithCustomColor: Story = () => (
  <TooltipProvider>
    <div className="p-20 flex gap-4 justify-center">
      <InfoIcon text="Default color" />
      <InfoIcon text="Primary color" className="text-primary" />
      <InfoIcon text="Muted color" className="text-muted" />
      <InfoIcon text="Error color" className="text-error" />
    </div>
  </TooltipProvider>
);
