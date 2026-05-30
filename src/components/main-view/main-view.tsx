import { type Configuration } from "@app/contexts";

import { useGetTrams } from "@app/hooks";
import {
  makeRow1Descriptor,
  makeRow2Descriptor,
  makeRow3Descriptor,
} from "@app/helpers";
import { PlatformMatrixWrapper } from "@app/components/platform-matrix-wrapper";

import { StyledMainView } from "./styles";

type MainViewProps = {
  configuration: Configuration;
};

const ALERT =
  "Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com.";

export const MainView = ({ configuration }: MainViewProps) => {
  const { data: trams = [] } = useGetTrams(configuration);

  const row1 = makeRow1Descriptor(trams);
  const row2 = makeRow2Descriptor(trams);
  const row3 = makeRow3Descriptor(ALERT);

  return (
    <StyledMainView>
      <PlatformMatrixWrapper rowDescriptors={{ row1, row2, row3 }} />
    </StyledMainView>
  );
};
