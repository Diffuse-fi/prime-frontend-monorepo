import type { Story, StoryDefault } from "@ladle/react";
import { Card } from "./Card";

export default {
  title: "Molecules/Surfaces/Card",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Card>
    <p>Card content goes here</p>
  </Card>
);

export const WithHeader: Story = () => (
  <div className="grid max-w-md gap-4">
    <Card header="Card Title">
      <p>This is a card with a simple string header</p>
    </Card>
  </div>
);

export const WithCustomHeader: Story = () => (
  <Card
    header={
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">Custom Header</span>
        <span className="text-muted text-sm">Action</span>
      </div>
    }
  >
    <p>This card has a custom header component</p>
  </Card>
);

export const WithComplexContent: Story = () => (
  <Card header="Statistics">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-muted">Total Value</span>
        <span className="text-lg font-semibold">$1,234.56</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted">APY</span>
        <span className="text-success text-lg font-semibold">12.5%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted">Risk Level</span>
        <span className="text-warning text-lg font-semibold">Medium</span>
      </div>
    </div>
  </Card>
);

export const MultipleCards: Story = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <Card header="Card 1">
      <p>First card content</p>
    </Card>
    <Card header="Card 2">
      <p>Second card content</p>
    </Card>
    <Card header="Card 3">
      <p>Third card content</p>
    </Card>
  </div>
);

export const LongContent: Story = () => (
  <Card header="Long Content Card" className="max-w-2xl">
    <div className="space-y-4">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </p>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur.
      </p>
    </div>
  </Card>
);
