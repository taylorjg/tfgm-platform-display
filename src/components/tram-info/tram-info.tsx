import { Box, Typography } from "@mui/material";

import { useGetTrams } from "@app/hooks";

import { StyledTramInfoInner, StyledTramInfoOuter } from "./styles";
import type { Configuration } from "@app/contexts";

type TramInfoProps = {
  configuration: Configuration;
};

export const TramInfo = ({ configuration }: TramInfoProps) => {
  const { data } = useGetTrams(configuration);

  return (
    <StyledTramInfoOuter>
      <StyledTramInfoInner>
        {data ? (
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              width: "100%",
              maxWidth: 520,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {data.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No trams due at this stop.
              </Typography>
            ) : (
              data.map((tram, index) => (
                <Box
                  component="li"
                  key={`${tram.destinationDisplay}-${tram.due}-${index}`}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 1,
                    py: 0.5,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle1" component="span">
                    {tram.destinationDisplay}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    {tram.status} · {tram.carriages} · {tram.due} min
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        ) : null}
      </StyledTramInfoInner>
    </StyledTramInfoOuter>
  );
};
