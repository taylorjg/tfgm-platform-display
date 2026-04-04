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
      id="options-tabpanel"
      aria-labelledby="options-tab"
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
