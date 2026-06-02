import { type Configuration } from "@app/contexts";

import { useGetTrams } from "@app/hooks";
import { PlatformDisplayWrapper } from "@app/components/platform-display-wrapper";

import { StyledMainView } from "./styles";

type MainViewProps = {
  configuration: Configuration;
};

const ALERT =
  "Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com.";

export const MainView = ({ configuration }: MainViewProps) => {
  const { data: trams = [] } = useGetTrams(configuration);

  return (
    <StyledMainView>
      <PlatformDisplayWrapper trams={trams} alert={ALERT} />
    </StyledMainView>
  );
};
