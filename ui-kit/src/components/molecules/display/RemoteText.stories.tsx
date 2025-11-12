import type { Story, StoryDefault } from "@ladle/react";
import { RemoteText } from "./RemoteText";
import { useState } from "react";

export default {
  title: "Molecules/Display/RemoteText",
} satisfies StoryDefault;

export const Default: Story = () => <RemoteText text="Loaded text" />;

export const Loading: Story = () => <RemoteText text="Loading..." isLoading />;

export const WithError: Story = () => (
  <RemoteText text="Failed to load" error="Network error occurred" />
);

export const States: Story = () => (
  <div className="space-y-4">
    <div>
      <p className="text-muted mb-2 text-sm">Default</p>
      <RemoteText text="1,234.56 ETH" />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Loading</p>
      <RemoteText text="Loading..." isLoading />
    </div>
    <div>
      <p className="text-muted mb-2 text-sm">Error</p>
      <RemoteText text="Failed" error="Could not fetch data" />
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
      setValue((Math.random() * 10000).toFixed(2));
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
        text={`${value} ETH`}
        isLoading={isLoading}
        error={hasError ? "Failed to load" : undefined}
      />
      <div className="flex gap-2">
        <button
          onClick={handleLoad}
          className="bg-primary text-fg rounded px-4 py-2"
          disabled={isLoading}
        >
          Reload
        </button>
        <button
          onClick={handleError}
          className="bg-error text-fg rounded px-4 py-2"
          disabled={isLoading}
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
    <RemoteText text="Heading text" textComponent="h3" className="text-xl font-bold" />
  </div>
);

export const InContext: Story = () => (
  <div className="max-w-md space-y-4">
    <div className="bg-fg border-border rounded border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted">Total Value Locked</span>
        <RemoteText text="$1,234,567.89" isLoading />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted">Your Balance</span>
        <RemoteText text="123.45 ETH" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted">APY</span>
        <RemoteText text="12.5%" error="Failed to load" />
      </div>
    </div>
  </div>
);
