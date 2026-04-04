import { useState } from "react";
import { Box, Drawer, Tab, Tabs } from "@mui/material";

import { ConfigurationTab } from "./ConfigurationTab.tsx";
import { OptionsTab } from "./OptionsTab.tsx";

export type SidePanelProps = {
  open: boolean;
  onClose: () => void;
};

export const SidePanel = ({ open, onClose }: SidePanelProps) => {
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
            id="configuration-tab"
            aria-controls="configuration-tabpanel"
          />
          <Tab
            label="Options"
            id="options-tab"
            aria-controls="options-tabpanel"
          />
        </Tabs>

        <Box sx={{ flex: 1, minHeight: 0, p: 2, overflow: "auto" }}>
          <ConfigurationTab hidden={tab !== 0} />
          <OptionsTab hidden={tab !== 1} />
        </Box>
      </Box>
    </Drawer>
  );
};
