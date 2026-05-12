import { Box, Typography } from "@mui/material";

import { type Configuration } from "@app/contexts";
import { useCurrentTime, useGetTrams } from "@app/hooks";
import { LedMatrixTest } from "@app/components/led-matrix-test";
import { Progress } from "@app/components/progress";

import { StyledTramInfoInner, StyledTramInfoOuter } from "./styles";
import { formatTime } from "@app/helpers";
import { fonts } from "@app/fonts";

type TramInfoProps = {
  configuration: Configuration;
};

export const TramInfo = ({ configuration }: TramInfoProps) => {
  const { data } = useGetTrams(configuration);
  const currentTime = useCurrentTime();
  const currentTimeFormatted = formatTime(currentTime);

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
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Progress />
            {data.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No trams due at this stop.
              </Typography>
            ) : (
              data.map((tram, index) => {
                const leftText = tram.destinationDisplay;
                const dbl = tram.carriages === "Double" ? "dbl" : "";
                const due = tram.due > 0 ? `${tram.due} min` : "";
                const rightText =
                  tram.status !== "Due"
                    ? tram.status
                    : [dbl, due].filter(Boolean).join(" ");

                return (
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
                      {leftText}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      {rightText}
                    </Typography>
                  </Box>
                );
              })
            )}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LedMatrixTest
                message="East Didsbury dbl 4 min"
                font={fonts[0]}
                width="600px"
                height="20px"
                numCols={185}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LedMatrixTest
                message="Manchester Airport 12 min"
                font={fonts[0]}
                width="600px"
                height="20px"
                numCols={185}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LedMatrixTest
                message="Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com."
                font={fonts[0]}
                width="600px"
                height="20px"
                numCols={185}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LedMatrixTest
                message={currentTimeFormatted}
                font={fonts[1]}
                width="200px"
                height="20px"
                numCols={61}
              />
            </div>
          </Box>
        ) : null}
      </StyledTramInfoInner>
    </StyledTramInfoOuter>
  );
};
