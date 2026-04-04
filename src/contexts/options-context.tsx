/* eslint-disable react-refresh/only-export-components -- context module exports hook and types-- */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

export type Options = {
  mode: "light" | "dark";
};

export type OptionsContextValue = {
  options: Options | null;
  setMode: (mode: "light" | "dark") => void;
};

const OptionsContext = createContext<OptionsContextValue | null>(null);

export type OptionsProviderProps = {
  children: ReactNode;
  initialOptions: Options | null;
};

export const OptionsProvider = ({
  children,
  initialOptions,
}: OptionsProviderProps) => {
  const [options, setOptions] = useState<Options | null>(initialOptions);

  const setMode = (mode: "light" | "dark") => {
    setOptions((prev) => ({ ...prev, mode }));
  };

  const theme = useMemo(
    () => createTheme({ palette: { mode: options?.mode } }),
    [options?.mode],
  );

  return (
    <OptionsContext.Provider value={{ options, setMode }}>
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
