import { fonts } from "@app/fonts";
import { formatTime } from "@app/helpers";
import { useCurrentTime } from "@app/hooks";
import { LedMatrixRow } from "./led-matrix-row";

export type LedMatrixRowsProps = {
  firstTram: string;
  secondTram: string;
  alert: string;
};

export const LedMatrixRows = ({
  firstTram,
  secondTram,
  alert,
}: LedMatrixRowsProps) => {
  const currentTime = useCurrentTime();
  const currentTimeFormatted = formatTime(currentTime);

  return (
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
      <LedMatrixRow
        font={fonts[0]}
        message={firstTram}
        width="1110px"
        height="52px"
        numCols={185}
      />
      <LedMatrixRow
        font={fonts[0]}
        message={secondTram}
        width="1110px"
        height="52px"
        numCols={185}
      />
      <LedMatrixRow
        font={fonts[0]}
        message={alert}
        width="1110px"
        height="52px"
        numCols={185}
      />
      <LedMatrixRow
        font={fonts[1]}
        message={currentTimeFormatted}
        width="366px"
        height="52px"
        numCols={63}
        centreMessage={true}
      />
    </div>
  );
};
