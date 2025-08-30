"use client";

import dynamic from "next/dynamic";

const ThemeSwitch = dynamic(() => import("./ThemeSwitcher"), {
  ssr: false,
  loading: () => <div>Skeleton</div>,
});

export default function ThemeSwitcher() {
  return <ThemeSwitch />;
}
