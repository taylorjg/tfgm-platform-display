import {
  FullscreenToggle,
  SidePanelIcon,
  MainView,
  Version,
} from "@app/components";
import { useConfiguration } from "@app/contexts";

export const App = () => {
  const { configuration } = useConfiguration();

  return (
    <>
      {configuration && <MainView configuration={configuration} />}
      <SidePanelIcon />
      <FullscreenToggle />
      <Version />
    </>
  );
};
