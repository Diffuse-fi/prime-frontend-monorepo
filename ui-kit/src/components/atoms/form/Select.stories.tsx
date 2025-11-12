import type { Story, StoryDefault } from "@ladle/react";
import { Select } from "./Select";
import { useState } from "react";

export default {
  title: "Atoms/Form/Select",
} satisfies StoryDefault;

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

const optionsWithIcons = [
  { value: "usa", label: "United States", icon: "🇺🇸" },
  { value: "uk", label: "United Kingdom", icon: "🇬🇧" },
  { value: "germany", label: "Germany", icon: "🇩🇪" },
  { value: "france", label: "France", icon: "🇫🇷" },
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
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder="Select..."
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
    <Select options={options} placeholder="Error state" error />
    <Select options={options} placeholder="Disabled state" disabled />
  </div>
);

export const WithDisabledOptions: Story = () => (
  <Select
    options={[
      { value: "option1", label: "Available Option 1" },
      { value: "option2", label: "Disabled Option", disabled: true },
      { value: "option3", label: "Available Option 2" },
    ]}
    placeholder="Select an option..."
  />
);

export const WithDefaultValue: Story = () => (
  <Select options={options} defaultValue="cherry" placeholder="Select..." />
);
