import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "@app/app";
import { DEFAULT_REFRESH_INTERVAL_MS } from "@app/constants";
import {
  ConfigurationProvider,
  OptionsProvider,
  type Configuration,
  type Options,
} from "@app/contexts";

export const testConfiguration: Configuration = {
  atcoCode: "9400ZZMASTW",
  serviceIds: ["Pink_Line", "Navy_Line"],
  towards: "ends",
};

export const testOptions: Options = {
  mode: "dark",
  refreshIntervalMs: DEFAULT_REFRESH_INTERVAL_MS,
};

export const renderApp = (
  configuration: Configuration | null = testConfiguration,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ConfigurationProvider initialConfiguration={configuration}>
        <OptionsProvider initialOptions={testOptions}>
          <App />
        </OptionsProvider>
      </ConfigurationProvider>
    </QueryClientProvider>,
  );
};
