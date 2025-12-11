import type { Story, StoryDefault } from "@ladle/react";
import { FormField } from "./FormField";
import { Input } from "@/atoms";

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
      <Input size="sm" placeholder="Small input" />
    </FormField>
    <FormField label="Medium" size="md">
      <Input size="md" placeholder="Medium input" />
    </FormField>
    <FormField label="Large" size="lg">
      <Input size="lg" placeholder="Large input" />
    </FormField>
  </div>
);

export const WithHint: Story = () => (
  <FormField label="Password" hint="Must be at least 8 characters">
    <Input type="password" placeholder="Enter password" />
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
    <Input type="email" placeholder="email@example.com" />
  </FormField>
);

export const Disabled: Story = () => (
  <FormField label="Username" disabled>
    <Input placeholder="johndoe" disabled />
  </FormField>
);

export const WithError: Story = () => (
  <FormField error label="Amount" hint="Insufficient balance">
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
    <FormField label="Email" hint="We'll never share your email">
      <Input type="email" placeholder="john.doe@example.com" />
    </FormField>
    <FormField label="Password" hint="Must be at least 8 characters">
      <Input type="password" placeholder="••••••••" />
    </FormField>
  </div>
);
