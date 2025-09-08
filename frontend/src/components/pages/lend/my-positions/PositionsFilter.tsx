import { PositionStatus } from "@/lib/core/usePositionsFilter";
import { showSkeletons } from "@/lib/misc/showSkeletons";
import { cn, RadioGroup, RadioGroupItem } from "@diffuse/ui-kit";

export interface PositionsFilterProps {
  className?: string;
  isLoading?: boolean;
}

export function PositionsFilter({ className, isLoading }: PositionsFilterProps) {
  const statuses: PositionStatus[] = ["all", "active", "closed"];
  return (
    <RadioGroup
      className={cn(
        "bg-muted animate-in-fade grid grid-cols-3 rounded-md p-1",
        className
      )}
    >
      {isLoading
        ? showSkeletons(3)
        : statuses.map(status => (
            <RadioGroupItem
              key={status}
              value={status}
              className={cn(
                "bg-fg text-text-primary cursor-pointer rounded-md px-3 py-2 text-center",
                status === "all" && "font-semibold"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </RadioGroupItem>
          ))}
    </RadioGroup>
  );
}
