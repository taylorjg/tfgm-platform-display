import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ColorModeProvider } from "@app/colorMode";
import { App } from "@app/App.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
