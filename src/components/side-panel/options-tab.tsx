import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import {
  REFRESH_INTERVAL_OPTIONS,
  type RefreshIntervalMs,
} from "@app/constants";
import { useOptions } from "@app/contexts";

export type OptionsTabProps = object;

export const OptionsTab = () => {
  const { options, setMode, setRefreshIntervalMs } = useOptions();

  return (
    <Box role="tabpanel" id="options-tabpanel" aria-labelledby="options-tab">
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={options.mode === "dark"}
              onChange={(_, checked) => setMode(checked ? "dark" : "light")}
              slotProps={{ input: { "aria-label": "Use dark theme" } }}
            />
          }
          label="Dark mode"
        />

        <Box>
          <Typography
            id="refresh-interval-label"
            variant="subtitle2"
            component="p"
            sx={{ mb: 1 }}
          >
            Refresh interval
          </Typography>
          <RadioGroup
            aria-labelledby="refresh-interval-label"
            name="refreshIntervalMs"
            value={options.refreshIntervalMs}
            onChange={(e) =>
              setRefreshIntervalMs(Number(e.target.value) as RefreshIntervalMs)
            }
          >
            {REFRESH_INTERVAL_OPTIONS.map(({ value, label }) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio size="small" />}
                label={label}
              />
            ))}
          </RadioGroup>
        </Box>
      </Stack>
    </Box>
  );
};
