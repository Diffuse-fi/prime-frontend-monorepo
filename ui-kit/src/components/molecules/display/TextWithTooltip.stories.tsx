import type { Story, StoryDefault } from "@ladle/react";

import { TextWithTooltip } from "./TextWithTooltip";
import { TooltipProvider } from "./Tooltip";

export default {
  decorators: [
    Component => (
      <TooltipProvider>
        <Component />
      </TooltipProvider>
    ),
  ],
  title: "Molecules/Display/TextWithTooltip",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="flex justify-center p-20">
    <p className="text-body">
      This text has a <TextWithTooltip text="tooltip" tooltip="Additional information" />{" "}
      word.
    </p>
  </div>
);

export const InParagraph: Story = () => (
  <div className="max-w-2xl p-20">
    <p className="text-body">
      The{" "}
      <TextWithTooltip
        text="Annual Percentage Yield"
        tooltip="APY represents the real rate of return on your investment over one year, taking into account the effect of compounding interest"
      />{" "}
      (APY) is calculated based on your deposits and the current lending rate. Your{" "}
      <TextWithTooltip
        text="health factor"
        tooltip="A numeric representation of the safety of your deposited assets against the borrowed assets. If it falls below 1.0, your position may be liquidated."
      />{" "}
      should always remain above 1.0 to avoid liquidation.
    </p>
  </div>
);

export const Sides: Story = () => (
  <div className="space-y-4 p-20">
    <p>
      Tooltip on <TextWithTooltip side="top" text="top" tooltip="Top tooltip" />
    </p>
    <p>
      Tooltip on <TextWithTooltip side="right" text="right" tooltip="Right tooltip" />
    </p>
    <p>
      Tooltip on <TextWithTooltip side="bottom" text="bottom" tooltip="Bottom tooltip" />
    </p>
    <p>
      Tooltip on <TextWithTooltip side="left" text="left" tooltip="Left tooltip" />
    </p>
  </div>
);

export const LongTooltip: Story = () => (
  <div className="p-20">
    <p className="text-body">
      Hover over{" "}
      <TextWithTooltip
        text="this term"
        tooltip="This is a much longer explanation that provides detailed information about the concept. It wraps to multiple lines and can contain comprehensive details about what the term means and how it's used in the context of the application."
      />{" "}
      for more info.
    </p>
  </div>
);

export const MultipleInLine: Story = () => (
  <div className="max-w-2xl p-20">
    <p className="text-body">
      The{" "}
      <TextWithTooltip
        text="liquidation threshold"
        tooltip="The percentage at which your loan will be eligible for liquidation"
      />{" "}
      is different from the{" "}
      <TextWithTooltip
        text="loan-to-value ratio"
        tooltip="The ratio of your borrowed amount to the value of your collateral"
      />
      , and both affect your{" "}
      <TextWithTooltip
        text="risk level"
        tooltip="A measure of how close you are to liquidation"
      />
      .
    </p>
  </div>
);

export const WithCustomStyling: Story = () => (
  <div className="p-20">
    <p className="text-body">
      This has a{" "}
      <TextWithTooltip
        className="text-primary font-semibold"
        text="custom styled"
        tooltip="Custom styling applied"
      />{" "}
      tooltip text.
    </p>
  </div>
);
