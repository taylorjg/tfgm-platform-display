import { type Configuration } from "@app/contexts";

import { useGetTrams } from "@app/hooks";
import { makeMessageDescriptors, type RowDescriptor } from "@app/helpers";
import { PlatformMatrixWrapper } from "@app/components/platform-matrix-wrapper";

import { StyledTramInfo } from "./styles";

type TramInfoProps = {
  configuration: Configuration;
};

const ALERT =
  "Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com.";

export const TramInfo = ({ configuration }: TramInfoProps) => {
  const { data: trams = [] } = useGetTrams(configuration);
  const messageDescriptors = makeMessageDescriptors(trams);

  const row1 = messageDescriptors[0];
  const row2 = messageDescriptors[1];
  const row3: RowDescriptor = {
    mode: "single",
    layout: {
      type: "simple",
      message: { type: "left", text: ALERT },
    },
  };

  return (
    <StyledTramInfo>
      <PlatformMatrixWrapper rowDescriptors={{ row1, row2, row3 }} />
    </StyledTramInfo>
  );
};
