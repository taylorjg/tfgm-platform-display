import {
  FullscreenToggle,
  SidePanelIcon,
  TramInfo,
  Version,
} from "@app/components";
import { useConfiguration } from "@app/contexts";

export const App = () => {
  const { configuration } = useConfiguration();

  return (
    <>
      {configuration && <TramInfo configuration={configuration} />}
      <SidePanelIcon />
      <FullscreenToggle />
      <Version />
    </>
  );
};
