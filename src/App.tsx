import { useState } from "react";

import { SettingsGear, SidePanel, Version } from "@app/components";

export const App = () => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  return (
    <>
      <SettingsGear onClick={() => setSidePanelOpen(true)} />
      <SidePanel open={sidePanelOpen} onClose={() => setSidePanelOpen(false)} />
      <Version />
    </>
  );
};
