/* eslint-disable react-refresh/only-export-components -- context module exports hook and types-- */
import { createContext, useContext, useState, type ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import { type RefreshIntervalMs } from "@app/constants";

export type Options = {
  mode: "light" | "dark";
  refreshIntervalMs: RefreshIntervalMs;
};

export type OptionsContextValue = {
  options: Options;
  setMode: (mode: "light" | "dark") => void;
  setRefreshIntervalMs: (refreshIntervalMs: RefreshIntervalMs) => void;
};

const OptionsContext = createContext<OptionsContextValue | null>(null);

export type OptionsProviderProps = {
  children: ReactNode;
  initialOptions: Options;
};

export const OptionsProvider = ({
  children,
  initialOptions,
}: OptionsProviderProps) => {
  const [options, setOptions] = useState<Options>(initialOptions);

  const setMode = (mode: "light" | "dark") => {
    setOptions((prev) => ({
      ...prev,
      mode,
    }));
  };

  const setRefreshIntervalMs = (refreshIntervalMs: RefreshIntervalMs) => {
    setOptions((prev) => ({
      ...prev,
      refreshIntervalMs,
    }));
  };

  const theme = createTheme({ palette: { mode: options?.mode } });

  return (
    <OptionsContext.Provider value={{ options, setMode, setRefreshIntervalMs }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within OptionsProvider");
  }
  return context;
};
