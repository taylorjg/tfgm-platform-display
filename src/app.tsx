import { useState } from "react";

import {
  SidePanel,
  SidePanelIconButton,
  TramInfo,
  Version,
} from "@app/components";
import { useConfiguration } from "@app/contexts";

export const App = () => {
  const { configuration } = useConfiguration();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const onOpenSidePanel = () => {
    setSidePanelOpen(true);
  };

  const onCloseSidePanel = () => {
    setSidePanelOpen(false);
  };

  return (
    <>
      {configuration && <TramInfo configuration={configuration} />}
      <SidePanelIconButton onClick={onOpenSidePanel} />
      <SidePanel open={sidePanelOpen} onClose={onCloseSidePanel} />
      <Version />
    </>
  );
};
