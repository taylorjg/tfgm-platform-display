/* eslint-disable react-refresh/only-export-components -- context module exports hook and types */
import { createContext, useContext, useState, type ReactNode } from "react";

export type Configuration = {
  atcoCode: string;
  serviceIds: string[];
  towards: "starts" | "ends";
};

export type ConfigurationContextValue = {
  configuration: Configuration | null;
  setConfiguration: (configuration: Configuration) => void;
};

const ConfigurationContext = createContext<ConfigurationContextValue | null>(
  null,
);

export type ConfigurationProviderProps = {
  children: ReactNode;
  initialConfiguration: Configuration | null;
};

export const ConfigurationProvider = ({
  children,
  initialConfiguration,
}: ConfigurationProviderProps) => {
  const [configuration, setConfiguration] = useState<Configuration | null>(
    initialConfiguration,
  );

  return (
    <ConfigurationContext.Provider value={{ configuration, setConfiguration }}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "useConfiguration must be used within ConfigurationProvider",
    );
  }
  return context;
};
