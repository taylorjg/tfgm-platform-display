import { useState } from "react";
import { Box, Drawer, Tab, Tabs } from "@mui/material";

import { Configuration } from "./Configuration.tsx";
import { Options } from "./Options.tsx";

export type SidePanelProps = {
  open: boolean;
  onClose: () => void;
};

export const SidePanel = function ({ open, onClose }: SidePanelProps) {
  const [tab, setTab] = useState(0);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 500,
            maxWidth: "90vw",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          pt: 1,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider", px: 1 }}
        >
          <Tab
            label="Configuration"
            id="side-panel-tab-0"
            aria-controls="side-panel-tabpanel-0"
          />
          <Tab
            label="Options"
            id="side-panel-tab-1"
            aria-controls="side-panel-tabpanel-1"
          />
        </Tabs>

        <Box sx={{ flex: 1, minHeight: 0, p: 2, overflow: "auto" }}>
          <Configuration hidden={tab !== 0} />
          <Options hidden={tab !== 1} />
        </Box>
      </Box>
    </Drawer>
  );
};
