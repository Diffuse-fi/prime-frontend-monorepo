import type { Story, StoryDefault } from "@ladle/react";
import { Tooltip, TooltipProvider } from "./Tooltip";
import { Button } from "@/atoms";

export default {
  title: "Molecules/Display/Tooltip",
  decorators: [
    Component => (
      <TooltipProvider>
        <Component />
      </TooltipProvider>
    ),
  ],
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="flex justify-center p-20">
    <Tooltip content="This is a tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  </div>
);

export const Sides: Story = () => (
  <div className="flex items-center justify-center gap-8 p-20">
    <Tooltip content="Top tooltip" side="top">
      <Button>Top</Button>
    </Tooltip>
    <Tooltip content="Right tooltip" side="right">
      <Button>Right</Button>
    </Tooltip>
    <Tooltip content="Bottom tooltip" side="bottom">
      <Button>Bottom</Button>
    </Tooltip>
    <Tooltip content="Left tooltip" side="left">
      <Button>Left</Button>
    </Tooltip>
  </div>
);

export const LongContent: Story = () => (
  <div className="flex justify-center p-20">
    <Tooltip content="This is a much longer tooltip that contains more information about the element">
      <Button>Hover for long tooltip</Button>
    </Tooltip>
  </div>
);

export const WithIcon: Story = () => (
  <div className="flex justify-center p-20">
    <Tooltip content="Click to copy address">
      <button className="text-2xl">📋</button>
    </Tooltip>
  </div>
);

export const MultipleTooltips: Story = () => (
  <div className="flex justify-center gap-4 p-20">
    <Tooltip content="First action">
      <Button size="sm">Action 1</Button>
    </Tooltip>
    <Tooltip content="Second action">
      <Button size="sm">Action 2</Button>
    </Tooltip>
    <Tooltip content="Third action">
      <Button size="sm">Action 3</Button>
    </Tooltip>
  </div>
);

export const OnText: Story = () => (
  <div className="max-w-md p-20">
    <p className="text-body">
      This is some text with a{" "}
      <Tooltip content="Additional information">
        <span className="cursor-help underline decoration-dashed">tooltip word</span>
      </Tooltip>{" "}
      in the middle of it.
    </p>
  </div>
);
