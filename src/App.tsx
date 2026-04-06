import { useState } from "react";

import { SettingsGear, SidePanel, TramInfo, Version } from "@app/components";
import { useConfiguration } from "./contexts";

export const App = () => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const { configuration } = useConfiguration();

  return (
    <>
      {configuration && <TramInfo configuration={configuration} />}
      <SettingsGear onClick={() => setSidePanelOpen(true)} />
      <SidePanel open={sidePanelOpen} onClose={() => setSidePanelOpen(false)} />
      <Version />
    </>
  );
};
