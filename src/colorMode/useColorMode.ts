import { useContext } from "react";

import { ColorModeContext } from "@app/colorMode/ColorModeContext.ts";
import type { ColorModeContextValue } from "@app/colorMode/ColorModeContext.ts";

export const useColorMode = (): ColorModeContextValue => {
  const ctx = useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return ctx;
};
