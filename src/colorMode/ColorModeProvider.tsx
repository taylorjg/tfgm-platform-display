import { useMemo, useState, type ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import { ColorModeContext, type ColorMode } from "./ColorModeContext.ts";

export type ColorModeProviderProps = {
  children: ReactNode;
};

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [mode, setMode] = useState<ColorMode>("dark");
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
