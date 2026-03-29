import type { Story, StoryDefault } from "@ladle/react";

import { useState } from "react";

import { Select } from "./Select";

export default {
  title: "Atoms/Form/Select",
} satisfies StoryDefault;

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
];

const optionsWithIcons = [
  { icon: "🇺🇸", label: "United States", value: "usa" },
  { icon: "🇬🇧", label: "United Kingdom", value: "uk" },
  { icon: "🇩🇪", label: "Germany", value: "germany" },
  { icon: "🇫🇷", label: "France", value: "france" },
];

export const Default: Story = () => (
  <Select options={options} placeholder="Select a fruit..." />
);

export const Sizes: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Select options={options} placeholder="Small select" size="sm" />
    <Select options={options} placeholder="Medium select" size="md" />
    <Select options={options} placeholder="Large select" size="lg" />
  </div>
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("banana");
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Select
        onValueChange={setValue}
        options={options}
        placeholder="Select..."
        value={value}
      />
      <p className="text-muted text-sm">Selected: {value}</p>
    </div>
  );
};

export const WithIcons: Story = () => (
  <Select options={optionsWithIcons} placeholder="Select a country..." />
);

export const States: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Select options={options} placeholder="Default state" />
    <Select error options={options} placeholder="Error state" />
    <Select disabled options={options} placeholder="Disabled state" />
  </div>
);

export const WithDisabledOptions: Story = () => (
  <Select
    options={[
      { label: "Available Option 1", value: "option1" },
      { disabled: true, label: "Disabled Option", value: "option2" },
      { label: "Available Option 2", value: "option3" },
    ]}
    placeholder="Select an option..."
  />
);

export const WithDefaultValue: Story = () => (
  <Select defaultValue="cherry" options={options} placeholder="Select..." />
);
