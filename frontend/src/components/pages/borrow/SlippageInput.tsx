import { cn, RadioGroup, RadioGroupItem, RadioGroupProps } from "@diffuse/ui-kit";

interface SlippageInputProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  dir?: RadioGroupProps["dir"];
  options: { label: string; value: string }[];
}

export function SlippageInput({
  value,
  onChange,
  className,
  dir,
  options,
}: SlippageInputProps) {
  return (
    <div className={cn("flex flex-col px-4", className)}>
      <div className="flex items-center justify-between">
        <span className="font-medium">Slippage up to</span>
        <span className="text-md font-bold">{value + "%"}</span>
      </div>
      <RadioGroup
        className={cn("mt-2! flex justify-end gap-4", className)}
        aria-label="Select an asset"
        dir={dir}
        value={value}
        onValueChange={value => {
          onChange?.(value);
        }}
      >
        {options.map(option => (
          <RadioGroupItem key={option.value} value={option.value} className="">
            <div
              className={cn(
                "bg-border/40 hover:bg-border cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors",
                value === option.value && "bg-border hover:bg-border"
              )}
            >
              {option.label}
            </div>
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  );
}
