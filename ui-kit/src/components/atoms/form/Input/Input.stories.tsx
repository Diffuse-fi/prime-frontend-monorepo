import type { Story, StoryDefault } from "@ladle/react";

import { useState } from "react";

import { Input } from "./Input";

export default {
  title: "Atoms/Form/Input",
} satisfies StoryDefault;

export const Default: Story = () => <Input placeholder="Enter text..." />;

export const Sizes: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Input placeholder="Small input" size="sm" />
    <Input placeholder="Medium input" size="md" />
    <Input placeholder="Large input" size="lg" />
  </div>
);

export const WithValue: Story = () => {
  const [value, setValue] = useState("Hello World");
  return (
    <Input
      onChange={e => setValue(e.target.value)}
      placeholder="Type something..."
      value={value}
    />
  );
};

export const States: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Input placeholder="Default state" />
    <Input error placeholder="Error state" />
    <Input disabled placeholder="Disabled state" />
  </div>
);

export const WithLeftIcon: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Input left={<span>🔍</span>} placeholder="Search..." />
    <Input left={<span>✉️</span>} placeholder="Email address" />
  </div>
);

export const WithRightIcon: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Input placeholder="Password" right={<span>👁️</span>} type="password" />
    <Input placeholder="Amount" right={<span>$</span>} />
  </div>
);

export const WithBothIcons: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Input
      left={<span className="text-muted">$</span>}
      placeholder="Enter amount"
      right={<span className="text-muted">USD</span>}
    />
  </div>
);

export const DifferentTypes: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Input placeholder="Text" type="text" />
    <Input placeholder="email@example.com" type="email" />
    <Input placeholder="Password" type="password" />
    <Input placeholder="123" type="number" />
    <Input type="date" />
  </div>
);
