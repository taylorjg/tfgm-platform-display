// import { Box, Typography } from "@mui/material";

import { type Configuration } from "@app/contexts";
// import { Progress } from "@app/components/progress";

import { useGetTrams, type LiveTram } from "@app/hooks";
import { makeMessageDescriptors } from "@app/helpers";
import { LedMatrixRows } from "@app/components/led-matrix-rows";
import { PlatformMatrixWrapper } from "@app/components/platform-matrix-wrapper";

import { StyledTramInfoInner, StyledTramInfoOuter } from "./styles";

type TramInfoProps = {
  configuration: Configuration;
};

const ALERT =
  "Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com.";

// const makeLeftRightText = (
//   tram: LiveTram | undefined,
// ): { leftText: string; rightText: string } => {
//   if (!tram) return { leftText: "", rightText: "" };

//   const leftText = tram.destinationDisplay;

//   const isDouble = tram.carriages === "Double";
//   const isDue = tram.status === "Due";
//   const dbl = isDouble ? "dbl" : "";
//   const mins = isDue ? `${tram.due} min` : "";
//   const rightTextParts = isDue ? [dbl, mins] : [dbl, tram.status];
//   const rightText = rightTextParts.filter(Boolean).join(" ");

//   return { leftText, rightText };
// };

export const TramInfo = ({ configuration }: TramInfoProps) => {
  const { data: trams = [] } = useGetTrams(configuration);
  const messageDescriptors = makeMessageDescriptors(trams);

  return (
    <>
      <StyledTramInfoOuter>
        <StyledTramInfoInner>
          {/* {trams ? (
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
              {trams.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No trams due at this stop.
                </Typography>
              ) : (
                trams.map((tram, index) => {
                  const { leftText, rightText } = makeLeftRightText(tram);

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
          ) : null} */}
        </StyledTramInfoInner>
      </StyledTramInfoOuter>
      <LedMatrixRows messageDescriptors={messageDescriptors} alert={ALERT} />
      <PlatformMatrixWrapper />
    </>
  );
};
