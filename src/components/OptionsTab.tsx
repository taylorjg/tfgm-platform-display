import { Box, FormControlLabel, Switch } from "@mui/material";

import { useColorMode } from "@app/colorMode";

export type OptionsTabProps = {
  hidden: boolean;
};

export const OptionsTab = ({ hidden }: OptionsTabProps) => {
  const { mode, setMode } = useColorMode();

  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      id="side-panel-tabpanel-1"
      aria-labelledby="side-panel-tab-1"
    >
      <FormControlLabel
        control={
          <Switch
            checked={mode === "dark"}
            onChange={(_, checked) => setMode(checked ? "dark" : "light")}
            slotProps={{ input: { "aria-label": "Use dark theme" } }}
          />
        }
        label="Dark mode"
      />
    </Box>
  );
};
