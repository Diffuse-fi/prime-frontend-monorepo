"use client";

import { Skeleton } from "@diffuse/ui-kit";
import dynamic from "next/dynamic";

const ThemeSwitch = dynamic(() => import("./ThemeSwitcher"), {
  ssr: false,
  loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
});

export default function ThemeSwitcher() {
  return <ThemeSwitch />;
}
