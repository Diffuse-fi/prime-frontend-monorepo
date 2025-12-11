import type { Story, StoryDefault } from "@ladle/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

export default {
  title: "Atoms/Form/Checkbox",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Checkbox label="I agree to the terms and conditions" />
);

export const Sizes: Story = () => (
  <div className="flex flex-col gap-4">
    <Checkbox size="sm" label="Small checkbox" />
    <Checkbox size="md" label="Medium checkbox" />
    <Checkbox size="lg" label="Large checkbox" />
  </div>
);

export const Controlled: Story = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Checkbox
        checked={checked}
        onCheckedChange={value => setChecked(Boolean(value))}
        label="Controlled checkbox"
      />
      <p className="text-muted text-sm">Checked: {checked ? "Yes" : "No"}</p>
    </div>
  );
};

export const WithDescription: Story = () => (
  <Checkbox
    label="I acknowledge the strategy exit process timing"
    description="The exit process may take up to 24 hours (2 hours on average). After completion, I can withdraw my collateral and rewards."
  />
);

export const States: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Checkbox label="Default state" />
    <Checkbox label="Error state" error />
    <Checkbox label="Disabled state" disabled />
  </div>
);

export const WithDisabledOptions: Story = () => (
  <div className="flex max-w-md flex-col gap-3">
    <Checkbox label="Available option 1" />
    <Checkbox label="Disabled option" disabled />
    <Checkbox label="Available option 2" />
  </div>
);

export const WithDefaultValue: Story = () => (
  <Checkbox
    defaultChecked
    label="Default checked"
    description="This checkbox is checked by default using the uncontrolled API."
  />
);
