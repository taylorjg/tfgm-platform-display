import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  ConfigurationProvider,
  OptionsProvider,
  type Configuration,
  type Options,
} from "@app/contexts";
import { App } from "@app/App.tsx";

const queryClient = new QueryClient();

// TODO: read initialConfiguration from local storage
const initialConfiguration: Configuration = {
  atcoCode: "9400ZZMASTW",
  serviceIds: ["Pink_Line", "Navy_Line"],
  towards: "ends",
};

// TODO: read initialOptions from local storage
const initialOptions: Options = {
  mode: "dark",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigurationProvider initialConfiguration={initialConfiguration}>
        <OptionsProvider initialOptions={initialOptions}>
          <App />
        </OptionsProvider>
      </ConfigurationProvider>
    </QueryClientProvider>
  </StrictMode>,
);
