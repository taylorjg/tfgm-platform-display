import { Alert, Box, Button } from "@mui/material";

import { type Configuration } from "@app/contexts";

import { useGetTrams } from "@app/hooks";
import { PlatformDisplayWrapper } from "@app/components/platform-display-wrapper";

import { StyledMainView } from "./styles";

type MainViewProps = {
  configuration: Configuration;
};

const ALERT =
  "Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com.";

export const MainView = ({ configuration }: MainViewProps) => {
  const { data, isError, refetch } = useGetTrams(configuration);
  const trams = data ?? [];
  const hasStaleData = isError && data !== undefined;

  return (
    <StyledMainView>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: 2,
        }}
      >
        {isError && (
          <Alert
            severity={hasStaleData ? "warning" : "error"}
            variant="outlined"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            {hasStaleData
              ? "Live data unavailable — showing last known information."
              : "Unable to load tram data."}
          </Alert>
        )}
        <PlatformDisplayWrapper trams={trams} alert={ALERT} />
      </Box>
    </StyledMainView>
  );
};
