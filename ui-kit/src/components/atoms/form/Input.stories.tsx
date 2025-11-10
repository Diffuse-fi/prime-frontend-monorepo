import type { Story } from "@ladle/react";
import { Input } from "./Input";
import { useState } from "react";

export const Default: Story = () => <Input placeholder="Enter text..." />;

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4 max-w-md">
    <Input placeholder="Small input" size="sm" />
    <Input placeholder="Medium input" size="md" />
    <Input placeholder="Large input" size="lg" />
  </div>
);

export const WithValue: Story = () => {
  const [value, setValue] = useState("Hello World");
  return (
    <Input
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Type something..."
    />
  );
};

export const States: Story = () => (
  <div className="flex flex-col gap-4 max-w-md">
    <Input placeholder="Default state" />
    <Input placeholder="Error state" error />
    <Input placeholder="Disabled state" disabled />
  </div>
);

export const WithLeftIcon: Story = () => (
  <div className="flex flex-col gap-4 max-w-md">
    <Input placeholder="Search..." left={<span>🔍</span>} />
    <Input placeholder="Email address" left={<span>✉️</span>} />
  </div>
);

export const WithRightIcon: Story = () => (
  <div className="flex flex-col gap-4 max-w-md">
    <Input placeholder="Password" type="password" right={<span>👁️</span>} />
    <Input placeholder="Amount" right={<span>$</span>} />
  </div>
);

export const WithBothIcons: Story = () => (
  <div className="flex flex-col gap-4 max-w-md">
    <Input
      placeholder="Enter amount"
      left={<span className="text-muted">$</span>}
      right={<span className="text-muted">USD</span>}
    />
  </div>
);

export const DifferentTypes: Story = () => (
  <div className="flex flex-col gap-4 max-w-md">
    <Input type="text" placeholder="Text" />
    <Input type="email" placeholder="email@example.com" />
    <Input type="password" placeholder="Password" />
    <Input type="number" placeholder="123" />
    <Input type="date" />
  </div>
);
