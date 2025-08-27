"use client";

import { useStrategies } from "@/lib/core/useStrategies";
import { useTokenList } from "@/lib/tokens/useTokensList";
import dynamic from "next/dynamic";

const ThemeSwitch = dynamic(() => import("./ThemeSwitcher"), {
  ssr: false,
  loading: () => <div>Skeleton</div>,
});

export default function ThemeSwitcher() {
  const tokensList = useTokenList();
  const { allStrategies } = useStrategies();
  console.log("tokensList", tokensList.data);
  return <ThemeSwitch />;
}
