import { Skeleton } from "@diffuse/ui-kit";

export function showSkeletons(count: number, className?: string) {
  return Array.from({ length: count }).map((_, i) => (
    <Skeleton key={i} className={className} />
  ));
}
