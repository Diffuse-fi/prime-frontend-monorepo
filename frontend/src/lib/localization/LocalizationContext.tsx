import { createContext } from "react";
import { Dictionary } from "./dictionaries";
import { Locale } from "./locale";

export type LocalizationValue = {
  lang: Locale;
  dictionary: Dictionary;
};

export const LocalizationContext = createContext<LocalizationValue | null>(null);
