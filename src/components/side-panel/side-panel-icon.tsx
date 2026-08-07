import { useState } from "react";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { SidePanel } from "./side-panel";

export const SidePanelIcon = () => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const onOpenSidePanel = () => {
    setSidePanelOpen(true);
  };

  const onCloseSidePanel = () => {
    setSidePanelOpen(false);
  };

  return (
    <>
      <IconButton
        type="button"
        aria-label="Open side panel"
        onClick={onOpenSidePanel}
        size="small"
        sx={{
          position: "fixed",
          top: "0.5rem",
          left: "0.5rem",
          color: "text.secondary",
        }}
      >
        <SettingsIcon fontSize="small" />
      </IconButton>
      <SidePanel open={sidePanelOpen} onClose={onCloseSidePanel} />
    </>
  );
};
