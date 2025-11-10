import "../src/theme/preset.css";
import type { GlobalProvider } from "@ladle/react";
import { useEffect } from "react";

export const Provider: GlobalProvider = ({ children, globalState }) => {
  useEffect(() => {
    // Apply dark theme class if dark mode is selected
    if (globalState.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [globalState.theme]);

  return <div className="bg-bg text-text-primary p-8">{children}</div>;
};
