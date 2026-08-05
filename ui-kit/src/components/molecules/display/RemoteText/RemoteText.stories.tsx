import type { Story, StoryDefault } from "@ladle/react";

import { useState } from "react";

import { RemoteText } from "./RemoteText";

export default {
  title: "Molecules/Display/RemoteText",
} satisfies StoryDefault;

export const Default: Story = () => <RemoteText text="Loaded text" />;

export const Loading: Story = () => <RemoteText isLoading text="Loading..." />;

export const WithError: Story = () => (
  <RemoteText error="Network error occurred" text="Failed to load" />
);

export const States: Story = () => (
  <div className="space-y-4">
    <div>
      <p className="text-muted mb-2 text-sm">Default</p>
      <RemoteText text="1,234.56 ETH" />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Loading</p>
      <RemoteText isLoading text="Loading..." />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Error</p>
      <RemoteText error="Could not fetch data" text="Failed" />
    </div>
  </div>
);

export const Interactive: Story = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState("1,234.56");

  const handleLoad = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      // eslint-disable-next-line sonarjs/pseudo-random
      setValue((Math.random() * 10_000).toFixed(2));
      setIsLoading(false);
    }, 2000);
  };

  const handleError = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <RemoteText
        error={hasError ? "Failed to load" : undefined}
        isLoading={isLoading}
        text={`${value} ETH`}
      />
      <div className="flex gap-2">
        <button
          className="bg-primary text-fg rounded px-4 py-2"
          disabled={isLoading}
          onClick={handleLoad}
        >
          Reload
        </button>
        <button
          className="bg-error text-fg rounded px-4 py-2"
          disabled={isLoading}
          onClick={handleError}
        >
          Trigger Error
        </button>
      </div>
    </div>
  );
};

export const CustomComponent: Story = () => (
  <div className="space-y-4">
    <RemoteText text="Span (default)" />
    <RemoteText text="Paragraph text" textComponent="p" />
    <RemoteText className="text-xl font-bold" text="Heading text" textComponent="h3" />
  </div>
);

export const InContext: Story = () => (
  <div className="max-w-md space-y-4">
    <div className="bg-fg border-border rounded border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted">Total Value Locked</span>
        <RemoteText isLoading text="$1,234,567.89" />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted">Your Balance</span>
        <RemoteText text="123.45 ETH" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted">APY</span>
        <RemoteText error="Failed to load" text="12.5%" />
      </div>
    </div>
  </div>
);
