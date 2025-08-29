"use client";

import { useStrategies } from "@/lib/core/useStrategies";
import dynamic from "next/dynamic";

const ThemeSwitch = dynamic(() => import("./ThemeSwitcher"), {
  ssr: false,
  loading: () => <div>Skeleton</div>,
});

export default function ThemeSwitcher() {
  const tokensList = useStrategies();
  console.log("tokensList", tokensList.strategies);
  return <ThemeSwitch />;
}
