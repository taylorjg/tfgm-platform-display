import { Box, FormControlLabel, Switch } from "@mui/material";

import { useColorMode } from "@app/colorMode/useColorMode.ts";

export type OptionsProps = {
  hidden: boolean;
};

export const Options = function ({ hidden }: OptionsProps) {
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
            inputProps={{ "aria-label": "Use dark theme" }}
          />
        }
        label="Dark mode"
      />
    </Box>
  );
};
