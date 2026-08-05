import type { Story, StoryDefault } from "@ladle/react";

import { Input } from "@/atoms";

import { FormField } from "./FormField";

export default {
  title: "Molecules/Form/FormField",
} satisfies StoryDefault;

export const Default: Story = () => (
  <FormField label="Email">
    <Input placeholder="Enter your email" />
  </FormField>
);

export const Sizes: Story = () => (
  <div className="max-w-md space-y-4">
    <FormField label="Small" size="sm">
      <Input placeholder="Small input" size="sm" />
    </FormField>
    <FormField label="Medium" size="md">
      <Input placeholder="Medium input" size="md" />
    </FormField>
    <FormField label="Large" size="lg">
      <Input placeholder="Large input" size="lg" />
    </FormField>
  </div>
);

export const WithHint: Story = () => (
  <FormField hint="Must be at least 8 characters" label="Password">
    <Input placeholder="Enter password" type="password" />
  </FormField>
);

export const Required: Story = () => (
  <FormField
    label={
      <>
        Email <span className="text-error">*</span>
      </>
    }
  >
    <Input placeholder="email@example.com" type="email" />
  </FormField>
);

export const Disabled: Story = () => (
  <FormField disabled label="Username">
    <Input disabled placeholder="johndoe" />
  </FormField>
);

export const WithError: Story = () => (
  <FormField error hint="Insufficient balance" label="Amount">
    <Input error placeholder="0.00" />
  </FormField>
);

export const ComplexLabel: Story = () => (
  <FormField
    label={
      <span className="flex w-full items-center justify-between">
        <span>Amount</span>
        <span className="text-muted text-xs font-normal">Balance: 1,234.56</span>
      </span>
    }
  >
    <Input placeholder="0.00" />
  </FormField>
);

export const MultipleFields: Story = () => (
  <div className="max-w-md space-y-4">
    <FormField label="First Name">
      <Input placeholder="John" />
    </FormField>
    <FormField label="Last Name">
      <Input placeholder="Doe" />
    </FormField>
    <FormField hint="We'll never share your email" label="Email">
      <Input placeholder="john.doe@example.com" type="email" />
    </FormField>
    <FormField hint="Must be at least 8 characters" label="Password">
      <Input placeholder="••••••••" type="password" />
    </FormField>
  </div>
);
