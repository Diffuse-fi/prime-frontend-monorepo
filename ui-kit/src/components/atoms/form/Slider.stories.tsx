import type { Story } from "@ladle/react";
import { Slider } from "./Slider";
import { useState } from "react";

export const Default: Story = () => <Slider defaultValue={[50]} max={100} step={1} />;

export const Controlled: Story = () => {
  const [value, setValue] = useState([25]);
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <Slider value={value} onValueChange={setValue} max={100} step={1} />
      <p className="text-sm text-muted">Value: {value[0]}</p>
    </div>
  );
};

export const DifferentSteps: Story = () => (
  <div className="flex flex-col gap-6 max-w-md">
    <div className="space-y-2">
      <label className="text-sm text-muted">Step: 1</label>
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
    <div className="space-y-2">
      <label className="text-sm text-muted">Step: 5</label>
      <Slider defaultValue={[50]} max={100} step={5} />
    </div>
    <div className="space-y-2">
      <label className="text-sm text-muted">Step: 10</label>
      <Slider defaultValue={[50]} max={100} step={10} />
    </div>
  </div>
);

export const DifferentRanges: Story = () => (
  <div className="flex flex-col gap-6 max-w-md">
    <div className="space-y-2">
      <label className="text-sm text-muted">0-100</label>
      <Slider defaultValue={[50]} min={0} max={100} step={1} />
    </div>
    <div className="space-y-2">
      <label className="text-sm text-muted">0-10</label>
      <Slider defaultValue={[5]} min={0} max={10} step={0.1} />
    </div>
    <div className="space-y-2">
      <label className="text-sm text-muted">-50 to 50</label>
      <Slider defaultValue={[0]} min={-50} max={50} step={1} />
    </div>
  </div>
);

export const Range: Story = () => {
  const [value, setValue] = useState([25, 75]);
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <Slider value={value} onValueChange={setValue} max={100} step={1} />
      <p className="text-sm text-muted">
        Range: {value[0]} - {value[1]}
      </p>
    </div>
  );
};

export const Disabled: Story = () => (
  <Slider defaultValue={[50]} max={100} step={1} disabled />
);
