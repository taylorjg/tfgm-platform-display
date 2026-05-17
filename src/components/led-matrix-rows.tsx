import { fonts } from "@app/fonts";
import { type MessageDescriptor } from "@app/helpers";
import { LedMatrixRow } from "./led-matrix-row";

export type LedMatrixRowsProps = {
  messageDescriptors: MessageDescriptor[];
  alert: string;
};

export const LedMatrixRows = ({
  messageDescriptors,
  alert,
}: LedMatrixRowsProps) => {
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
        numCols={185}
        messageDescriptor={messageDescriptors[0]}
        width="1110px"
        height="52px"
      />

      <LedMatrixRow
        font={fonts[0]}
        numCols={185}
        messageDescriptor={messageDescriptors[1]}
        width="1110px"
        height="52px"
      />

      <LedMatrixRow
        font={fonts[0]}
        numCols={185}
        messageDescriptor={alertMessageDescriptor}
        width="1110px"
        height="52px"
      />

      <LedMatrixRow
        font={fonts[1]}
        numCols={63}
        messageDescriptor={clockMessageDescriptor}
        width="366px"
        height="52px"
      />
    </div>
  );
};
