import { Card, cn, Heading } from "@diffuse/ui-kit";
import { ReactNode } from "react";

export interface InfoCardProps {
  className?: string;
  header: string;
  icon: ReactNode;
  iconBgClassName?: string;
  info: ReactNode;
}

export function InfoCard({
  className,
  header,
  icon,
  iconBgClassName,
  info,
}: InfoCardProps) {
  return (
    <Card
      cardBodyClassName="flex flex-row items-center justify-between gap-10"
      className={cn("rounded-[128px] p-5", className)}
    >
      <div>
        <Heading className="text-text-dimmed" level="5">
          {header}
        </Heading>
        {info}
      </div>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          iconBgClassName
        )}
      >
        {icon}
      </div>
    </Card>
  );
}
