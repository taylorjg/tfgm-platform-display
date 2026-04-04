import { Box, FormControlLabel, Switch } from "@mui/material";

import { useOptions } from "@app/contexts";

export type OptionsTabProps = object;

export const OptionsTab = () => {
  const { options, setMode } = useOptions();

  return (
    <Box role="tabpanel" id="options-tabpanel" aria-labelledby="options-tab">
      <FormControlLabel
        control={
          <Switch
            checked={options?.mode === "dark"}
            onChange={(_, checked) => setMode?.(checked ? "dark" : "light")}
            slotProps={{ input: { "aria-label": "Use dark theme" } }}
          />
        }
        label="Dark mode"
      />
    </Box>
  );
};
