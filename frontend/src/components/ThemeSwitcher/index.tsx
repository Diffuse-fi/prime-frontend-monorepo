"use client";

import { useTokensList } from "@/lib/tokens/useTokensList";
import dynamic from "next/dynamic";

const ThemeSwitch = dynamic(() => import("./ThemeSwitcher"), {
  ssr: false,
  loading: () => <div>Skeleton</div>,
});

export default function ThemeSwitcher() {
  const tokensList = useTokensList();
  console.log("tokensList", tokensList);
  return <ThemeSwitch />;
}
