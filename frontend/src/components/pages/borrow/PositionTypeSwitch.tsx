import { ButtonLike, cn, RadioGroup, RadioGroupItem, Skeleton } from "@diffuse/ui-kit";
import { RadioGroupProps } from "@diffuse/ui-kit/RadioGroup";

export type PositionTypeOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

interface PositionTypeSwitchProps {
  className?: string;
  direction?: RadioGroupProps["dir"];
  isLoading?: boolean;
  onSelect?: (option: PositionTypeOption) => void;
  options: PositionTypeOption[];
  selected?: null | PositionTypeOption;
  skeletonsToShow?: number;
}

export function PositionTypeSwitch({
  className,
  direction,
  isLoading,
  onSelect,
  options,
  selected,
  skeletonsToShow = 2,
}: PositionTypeSwitchProps) {
  return (
    <RadioGroup
      aria-label="Select position type"
      className={cn("flex items-center gap-3", className)}
      dir={direction}
      onValueChange={value => {
        const option = options.find(o => o.value === value);
        if (option) onSelect?.(option);
      }}
      value={selected?.value}
    >
      {isLoading
        ? Array.from({ length: skeletonsToShow }).map((_, i) => (
            <Skeleton className="h-10 w-28 rounded-full" key={i} />
          ))
        : options.map(option => {
            const active = selected?.value === option.value;

            return (
              <RadioGroupItem
                className="w-fit rounded-full"
                disabled={option.disabled}
                key={option.value}
                onClick={() => onSelect?.(option)}
                value={option.value}
              >
                <ButtonLike
                  className={cn(
                    "h-10 rounded-full px-6 text-sm font-medium",
                    active
                      ? "bg-primary/10 text-primary border border-transparent"
                      : cn(
                          "text-text-dimmed border-muted/40 border bg-transparent",
                          !option.disabled && "hover:bg-muted/10",
                          option.disabled && "cursor-not-allowed hover:bg-transparent"
                        )
                  )}
                  component="div"
                  onClick={() => onSelect?.(option)}
                  variant="ghost"
                >
                  {option.label}
                </ButtonLike>
              </RadioGroupItem>
            );
          })}
    </RadioGroup>
  );
}
