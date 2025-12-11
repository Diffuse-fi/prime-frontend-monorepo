import { cn, RadioGroup, RadioGroupItem, RadioGroupProps } from "@diffuse/ui-kit";

interface SlippageInputProps {
  className?: string;
  dir?: RadioGroupProps["dir"];
  onChange?: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}

export function SlippageInput({
  className,
  dir,
  onChange,
  options,
  value,
}: SlippageInputProps) {
  return (
    <div className={cn("flex flex-col px-4", className)}>
      <div className="flex items-center justify-between">
        <span className="font-medium">Slippage up to</span>
        <span className="text-md font-bold">{value + "%"}</span>
      </div>
      <RadioGroup
        aria-label="Select an asset"
        className="mt-4 flex justify-end gap-4"
        dir={dir}
        onValueChange={value => {
          onChange?.(value);
        }}
        value={value}
      >
        {options.map(option => (
          <RadioGroupItem
            className={cn(
              "bg-border/40 hover:bg-border rounded-md px-3 py-1 text-sm font-medium transition-colors",
              value === option.value && "bg-border hover:bg-border"
            )}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  );
}
