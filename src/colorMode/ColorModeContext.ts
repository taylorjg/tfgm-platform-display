import { createContext } from "react";

export type ColorMode = "light" | "dark";

export type ColorModeContextValue = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
};

export const ColorModeContext = createContext<ColorModeContextValue | null>(
  null,
);
