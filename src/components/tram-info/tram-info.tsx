import { Box, Typography } from "@mui/material";

import { useGetTrams } from "@app/hooks";
import { type Configuration } from "@app/contexts";
import { Progress } from "@app/components/progress";

import { StyledTramInfoInner, StyledTramInfoOuter } from "./styles";

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
              display: "flex",
              flexDirection: "column",
              gap: 1,
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
          </Box>
        ) : null}
      </StyledTramInfoInner>
    </StyledTramInfoOuter>
  );
};
