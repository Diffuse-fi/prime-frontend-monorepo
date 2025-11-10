import type { Story } from "@ladle/react";
import { RemoteText } from "./RemoteText";
import { useState } from "react";

export const Default: Story = () => <RemoteText text="Loaded text" />;

export const Loading: Story = () => <RemoteText text="Loading..." isLoading />;

export const WithError: Story = () => (
  <RemoteText text="Failed to load" error="Network error occurred" />
);

export const States: Story = () => (
  <div className="space-y-4">
    <div>
      <p className="text-sm text-muted mb-2">Default</p>
      <RemoteText text="1,234.56 ETH" />
    </div>
    <div>
      <p className="text-sm text-muted mb-2">Loading</p>
      <RemoteText text="Loading..." isLoading />
    </div>
    <div>
      <p className="text-sm text-muted mb-2">Error</p>
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
          className="px-4 py-2 bg-primary text-fg rounded"
          disabled={isLoading}
        >
          Reload
        </button>
        <button
          onClick={handleError}
          className="px-4 py-2 bg-error text-fg rounded"
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
  <div className="space-y-4 max-w-md">
    <div className="p-4 bg-fg border border-border rounded">
      <div className="flex justify-between items-center mb-2">
        <span className="text-muted">Total Value Locked</span>
        <RemoteText text="$1,234,567.89" isLoading />
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-muted">Your Balance</span>
        <RemoteText text="123.45 ETH" />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-muted">APY</span>
        <RemoteText text="12.5%" error="Failed to load" />
      </div>
    </div>
  </div>
);
