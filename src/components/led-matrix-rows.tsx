import { fonts } from "@app/fonts";
import { formatTime, type MessageDescriptor } from "@app/helpers";
import { useCurrentTime } from "@app/hooks";
import { LedMatrixRow } from "./led-matrix-row";

export type LedMatrixRowsProps = {
  messageDescriptors: MessageDescriptor[];
  alert: string;
  firstTram: string;
  secondTram: string;
};

export const LedMatrixRows = ({
  messageDescriptors,
  alert,
  firstTram,
  secondTram,
}: LedMatrixRowsProps) => {
  const currentTime = useCurrentTime();
  const currentTimeFormatted = formatTime(currentTime);

  const alertMessageDescriptor: MessageDescriptor = {
    mode: "single",
    layout: {
      type: "simple",
      message: {
        type: "left",
        text: alert,
      },
    },
  };

  const clockMessageDescriptor: MessageDescriptor = {
    mode: "clock",
  };

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
        messageDescriptor={messageDescriptors[0]}
        message={firstTram}
        width="1110px"
        height="52px"
        numCols={185}
      />

      <LedMatrixRow
        font={fonts[0]}
        messageDescriptor={messageDescriptors[1]}
        message={secondTram}
        width="1110px"
        height="52px"
        numCols={185}
      />

      <LedMatrixRow
        font={fonts[0]}
        messageDescriptor={alertMessageDescriptor}
        message={alert}
        width="1110px"
        height="52px"
        numCols={185}
      />

      <LedMatrixRow
        font={fonts[1]}
        messageDescriptor={clockMessageDescriptor}
        message={currentTimeFormatted}
        centreMessage={true}
        width="366px"
        height="52px"
        numCols={63}
      />
    </div>
  );
};
