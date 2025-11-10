import type { Story } from "@ladle/react";
import { Card } from "./Card";

export const Default: Story = () => (
  <Card>
    <p>Card content goes here</p>
  </Card>
);

export const WithHeader: Story = () => (
  <div className="grid gap-4 max-w-md">
    <Card header="Card Title">
      <p>This is a card with a simple string header</p>
    </Card>
  </div>
);

export const WithCustomHeader: Story = () => (
  <Card
    header={
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">Custom Header</span>
        <span className="text-sm text-muted">Action</span>
      </div>
    }
  >
    <p>This card has a custom header component</p>
  </Card>
);

export const WithComplexContent: Story = () => (
  <Card header="Statistics">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-muted">Total Value</span>
        <span className="font-semibold text-lg">$1,234.56</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-muted">APY</span>
        <span className="font-semibold text-lg text-success">12.5%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-muted">Risk Level</span>
        <span className="font-semibold text-lg text-warning">Medium</span>
      </div>
    </div>
  </Card>
);

export const MultipleCards: Story = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
