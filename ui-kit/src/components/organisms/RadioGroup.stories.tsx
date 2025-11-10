import type { Story } from "@ladle/react";
import { RadioGroup } from "./RadioGroup";
import { useState } from "react";

export const Default: Story = () => (
  <RadioGroup defaultValue="option1">
    <RadioGroup.Item value="option1">
      <div className="p-4 border border-border rounded hover:bg-muted/10">
        <div className="font-medium">Option 1</div>
        <div className="text-sm text-muted">Description for option 1</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="option2">
      <div className="p-4 border border-border rounded hover:bg-muted/10">
        <div className="font-medium">Option 2</div>
        <div className="text-sm text-muted">Description for option 2</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="option3">
      <div className="p-4 border border-border rounded hover:bg-muted/10">
        <div className="font-medium">Option 3</div>
        <div className="text-sm text-muted">Description for option 3</div>
      </div>
    </RadioGroup.Item>
  </RadioGroup>
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("fast");
  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroup.Item value="slow">
          <div className="p-4 border border-border rounded hover:bg-muted/10">
            <div className="font-medium">Slow (Lowest Fee)</div>
            <div className="text-sm text-muted">~10 minutes</div>
          </div>
        </RadioGroup.Item>
        <RadioGroup.Item value="medium">
          <div className="p-4 border border-border rounded hover:bg-muted/10">
            <div className="font-medium">Medium</div>
            <div className="text-sm text-muted">~5 minutes</div>
          </div>
        </RadioGroup.Item>
        <RadioGroup.Item value="fast">
          <div className="p-4 border border-border rounded hover:bg-muted/10">
            <div className="font-medium">Fast (Highest Fee)</div>
            <div className="text-sm text-muted">~1 minute</div>
          </div>
        </RadioGroup.Item>
      </RadioGroup>
      <p className="text-sm text-muted">Selected: {value}</p>
    </div>
  );
};

export const WithDisabled: Story = () => (
  <RadioGroup defaultValue="option1">
    <RadioGroup.Item value="option1">
      <div className="p-4 border border-border rounded hover:bg-muted/10">
        <div className="font-medium">Available Option</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="option2" disabled>
      <div className="p-4 border border-border rounded opacity-50">
        <div className="font-medium">Disabled Option</div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="option3">
      <div className="p-4 border border-border rounded hover:bg-muted/10">
        <div className="font-medium">Another Available Option</div>
      </div>
    </RadioGroup.Item>
  </RadioGroup>
);

export const Compact: Story = () => (
  <RadioGroup defaultValue="yes">
    <RadioGroup.Item value="yes">
      <div className="p-3 border border-border rounded hover:bg-muted/10 text-sm">Yes</div>
    </RadioGroup.Item>
    <RadioGroup.Item value="no">
      <div className="p-3 border border-border rounded hover:bg-muted/10 text-sm">No</div>
    </RadioGroup.Item>
    <RadioGroup.Item value="maybe">
      <div className="p-3 border border-border rounded hover:bg-muted/10 text-sm">Maybe</div>
    </RadioGroup.Item>
  </RadioGroup>
);

export const WithIcons: Story = () => (
  <RadioGroup defaultValue="card">
    <RadioGroup.Item value="card">
      <div className="p-4 border border-border rounded hover:bg-muted/10 flex items-center gap-3">
        <span className="text-2xl">💳</span>
        <div>
          <div className="font-medium">Credit Card</div>
          <div className="text-sm text-muted">Pay with credit card</div>
        </div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="bank">
      <div className="p-4 border border-border rounded hover:bg-muted/10 flex items-center gap-3">
        <span className="text-2xl">🏦</span>
        <div>
          <div className="font-medium">Bank Transfer</div>
          <div className="text-sm text-muted">Direct bank transfer</div>
        </div>
      </div>
    </RadioGroup.Item>
    <RadioGroup.Item value="crypto">
      <div className="p-4 border border-border rounded hover:bg-muted/10 flex items-center gap-3">
        <span className="text-2xl">₿</span>
        <div>
          <div className="font-medium">Cryptocurrency</div>
          <div className="text-sm text-muted">Pay with crypto</div>
        </div>
      </div>
    </RadioGroup.Item>
  </RadioGroup>
);
