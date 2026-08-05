import type { Story, StoryDefault } from "@ladle/react";

import { useState } from "react";

import { RadioGroup } from "./RadioGroup";

export default {
  title: "Organisms/RadioGroup",
} satisfies StoryDefault;

export const Default: Story = () => (
  <RadioGroup defaultValue="option1">
    <RadioGroup.Item value="option1">
      <div className="border-border hover:bg-muted/10 rounded border p-4">
        <div className="font-medium">Option 1</div>
        <div className="text-muted text-sm">Description for option 1</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="option2">
      <div className="border-border hover:bg-muted/10 rounded border p-4">
        <div className="font-medium">Option 2</div>
        <div className="text-muted text-sm">Description for option 2</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="option3">
      <div className="border-border hover:bg-muted/10 rounded border p-4">
        <div className="font-medium">Option 3</div>
        <div className="text-muted text-sm">Description for option 3</div>
      </div>
    </RadioGroup.Item>
  </RadioGroup>
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("fast");
  return (
    <div className="space-y-4">
      <RadioGroup onValueChange={setValue} value={value}>
        <RadioGroup.Item value="slow">
          <div className="border-border hover:bg-muted/10 rounded border p-4">
            <div className="font-medium">Slow (Lowest Fee)</div>
            <div className="text-muted text-sm">~10 minutes</div>
          </div>
        </RadioGroup.Item>
        <RadioGroup.Item value="medium">
          <div className="border-border hover:bg-muted/10 rounded border p-4">
            <div className="font-medium">Medium</div>
            <div className="text-muted text-sm">~5 minutes</div>
          </div>
        </RadioGroup.Item>
        <RadioGroup.Item value="fast">
          <div className="border-border hover:bg-muted/10 rounded border p-4">
            <div className="font-medium">Fast (Highest Fee)</div>
            <div className="text-muted text-sm">~1 minute</div>
          </div>
        </RadioGroup.Item>
      </RadioGroup>
      <p className="text-muted text-sm">Selected: {value}</p>
    </div>
  );
};

export const WithDisabled: Story = () => (
  <RadioGroup defaultValue="option1">
    <RadioGroup.Item value="option1">
      <div className="border-border hover:bg-muted/10 rounded border p-4">
        <div className="font-medium">Available Option</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item disabled value="option2">
      <div className="border-border rounded border p-4 opacity-50">
        <div className="font-medium">Disabled Option</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="option3">
      <div className="border-border hover:bg-muted/10 rounded border p-4">
        <div className="font-medium">Another Available Option</div>
      </div>
    </RadioGroup.Item>
  </RadioGroup>
);

export const Compact: Story = () => (
  <RadioGroup defaultValue="yes">
    <RadioGroup.Item value="yes">
      <div className="border-border hover:bg-muted/10 rounded border p-3 text-sm">
        Yes
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="no">
      <div className="border-border hover:bg-muted/10 rounded border p-3 text-sm">No</div>
    </RadioGroup.Item>
    <RadioGroup.Item value="maybe">
      <div className="border-border hover:bg-muted/10 rounded border p-3 text-sm">
        Maybe
      </div>
    </RadioGroup.Item>
  </RadioGroup>
);

export const WithIcons: Story = () => (
  <RadioGroup defaultValue="card">
    <RadioGroup.Item value="card">
      <div className="border-border hover:bg-muted/10 flex items-center gap-3 rounded border p-4">
        <span className="text-2xl">💳</span>
        <div>
          <div className="font-medium">Credit Card</div>
          <div className="text-muted text-sm">Pay with credit card</div>
        </div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="bank">
      <div className="border-border hover:bg-muted/10 flex items-center gap-3 rounded border p-4">
        <span className="text-2xl">🏦</span>
        <div>
          <div className="font-medium">Bank Transfer</div>
          <div className="text-muted text-sm">Direct bank transfer</div>
        </div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="crypto">
      <div className="border-border hover:bg-muted/10 flex items-center gap-3 rounded border p-4">
        <span className="text-2xl">₿</span>
        <div>
          <div className="font-medium">Cryptocurrency</div>
          <div className="text-muted text-sm">Pay with crypto</div>
        </div>
      </div>
    </RadioGroup.Item>
  </RadioGroup>
);
