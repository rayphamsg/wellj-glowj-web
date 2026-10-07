import { en } from "@/content/en";
import type { Dictionary } from "@/content/types";
import { vi } from "@/content/vi";
import type { Locale } from "./locales";

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
