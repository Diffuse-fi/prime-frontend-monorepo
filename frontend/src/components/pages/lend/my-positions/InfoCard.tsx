import { Card, cn, Heading } from "@diffuse/ui-kit";
import { ReactNode } from "react";

export interface InfoCardProps {
  header: string;
  info: ReactNode;
  className?: string;
  icon: ReactNode;
  iconBgClassName?: string;
}

export function InfoCard({
  header,
  info,
  className,
  icon,
  iconBgClassName,
}: InfoCardProps) {
  return (
    <Card
      cardBodyClassName="flex flex-row items-center justify-between gap-10"
      className={cn("rounded-[128px] p-5", className)}
    >
      <div>
        <Heading level="5" className="text-text-dimmed">
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
