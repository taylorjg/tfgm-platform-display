import { Box, Typography } from "@mui/material";

import { type Configuration } from "@app/contexts";
import { useCurrentTime, useGetTrams, type LiveTram } from "@app/hooks";
import { LedMatrixTest } from "@app/components/led-matrix-test";
import { Progress } from "@app/components/progress";

import { StyledTramInfoInner, StyledTramInfoOuter } from "./styles";
import { formatTime } from "@app/helpers";
import { fonts } from "@app/fonts";

type TramInfoProps = {
  configuration: Configuration;
};

const HARDCODED_ALERT =
  "Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com.";

const makeLeftRightText = (tram: LiveTram | undefined) => {
  if (!tram) return { leftText: "", rightText: "", message: "" };

  const leftText = tram.destinationDisplay;

  const dbl = tram.carriages === "Double" ? "dbl" : "";
  const due = tram.due > 0 ? `${tram.due} min` : "";
  const rightText =
    tram.status !== "Due" ? tram.status : [dbl, due].filter(Boolean).join(" ");

  return { leftText, rightText, message: [leftText, rightText].join("|") };
};

export const TramInfo = ({ configuration }: TramInfoProps) => {
  const { data } = useGetTrams(configuration);
  const currentTime = useCurrentTime();
  const currentTimeFormatted = formatTime(currentTime);

  const firstTram = data?.[0];
  const secondTram = data?.[1];
  const firstLeftRightText = makeLeftRightText(firstTram);
  const secondLeftRightText = makeLeftRightText(secondTram);

  return (
    <>
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
          ) : null}
        </StyledTramInfoInner>
      </StyledTramInfoOuter>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          border: "10px solid grey",
          padding: "10px",
          margin: "50px",
        }}
      >
        <LedMatrixTest
          message={firstLeftRightText.message}
          font={fonts[0]}
          width="1110px"
          height="52px"
          numCols={185}
        />
        <LedMatrixTest
          message={secondLeftRightText.message}
          font={fonts[0]}
          width="1110px"
          height="52px"
          numCols={185}
        />
        <LedMatrixTest
          message={HARDCODED_ALERT}
          font={fonts[0]}
          width="1110px"
          height="52px"
          numCols={185}
        />
        <LedMatrixTest
          message={currentTimeFormatted}
          font={fonts[1]}
          width="366px"
          height="52px"
          numCols={61}
        />
      </div>
    </>
  );
};
