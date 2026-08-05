import type { Story, StoryDefault } from "@ladle/react";

import { Skeleton } from "./Skeleton";

export default {
  title: "Atoms/Feedback/Skeleton",
} satisfies StoryDefault;

export const Default: Story = () => <Skeleton className="h-4 w-48" />;

export const Rounded: Story = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-48" rounded="sm" />
    <Skeleton className="h-4 w-48" rounded="md" />
    <Skeleton className="h-4 w-48" rounded="lg" />
    <Skeleton className="h-12 w-12" rounded="full" />
  </div>
);

export const DifferentSizes: Story = () => (
  <div className="space-y-4">
    <Skeleton className="h-2 w-32" />
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-6 w-64" />
    <Skeleton className="h-12 w-full" />
  </div>
);

export const CardSkeleton: Story = () => (
  <div className="bg-fg border-border max-w-md space-y-4 rounded-lg border p-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12" rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-3/4" />
  </div>
);

export const TableSkeleton: Story = () => (
  <div className="space-y-2">
    <div className="flex gap-4">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 flex-1" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </div>
);

export const ListSkeleton: Story = () => (
  <div className="max-w-md space-y-3">
    {[1, 2, 3, 4].map(i => (
      <div className="flex items-center gap-3" key={i}>
        <Skeleton className="h-10 w-10" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
