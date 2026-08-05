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
    <Checkbox label="Small checkbox" size="sm" />
    <Checkbox label="Medium checkbox" size="md" />
    <Checkbox label="Large checkbox" size="lg" />
  </div>
);

export const Controlled: Story = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Checkbox
        checked={checked}
        label="Controlled checkbox"
        onCheckedChange={value => setChecked(Boolean(value))}
      />
      <p className="text-muted text-sm">Checked: {checked ? "Yes" : "No"}</p>
    </div>
  );
};

export const WithDescription: Story = () => (
  <Checkbox
    description="The exit process may take up to 24 hours (2 hours on average). After completion, I can withdraw my collateral and rewards."
    label="I acknowledge the strategy exit process timing"
  />
);

export const States: Story = () => (
  <div className="flex max-w-md flex-col gap-4">
    <Checkbox label="Default state" />
    <Checkbox error label="Error state" />
    <Checkbox disabled label="Disabled state" />
  </div>
);

export const WithDisabledOptions: Story = () => (
  <div className="flex max-w-md flex-col gap-3">
    <Checkbox label="Available option 1" />
    <Checkbox disabled label="Disabled option" />
    <Checkbox label="Available option 2" />
  </div>
);

export const WithDefaultValue: Story = () => (
  <Checkbox
    defaultChecked
    description="This checkbox is checked by default using the uncontrolled API."
    label="Default checked"
  />
);
