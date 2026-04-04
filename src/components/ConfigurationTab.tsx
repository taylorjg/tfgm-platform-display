import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";

import { useTramStops, type TramStop } from "@app/hooks";

export type ConfigurationTabProps = {
  hidden: boolean;
};

export const ConfigurationTab = ({ hidden }: ConfigurationTabProps) => {
  const { data, isPending, isError, error } = useTramStops();
  const [selectedTramStop, setSelectedTramStop] = useState<TramStop | null>(
    null,
  );

  const handleTramStopChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (value === "" || !data) {
      setSelectedTramStop(null);
      return;
    }
    const stop = data.find((s) => s.atcoCode === value);
    setSelectedTramStop(stop ?? null);
  };

  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      id="side-panel-tabpanel-0"
      aria-labelledby="side-panel-tab-0"
      sx={{ minHeight: 0 }}
    >
      {isPending ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} aria-label="Loading tram stops" />
        </Box>
      ) : null}

      {isError ? (
        <Alert severity="error">
          {error instanceof Error ? error.message : "Failed to load tram stops"}
        </Alert>
      ) : null}

      {!isPending && !isError && data?.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No tram stops found.
        </Typography>
      ) : null}

      {!isPending && !isError && data && data.length > 0 ? (
        <FormControl fullWidth size="small">
          <InputLabel id="tram-stop-select-label">Tram stop</InputLabel>
          <Select
            labelId="tram-stop-select-label"
            id="tram-stop-select"
            label="Tram stop"
            value={selectedTramStop?.atcoCode ?? ""}
            onChange={handleTramStopChange}
            displayEmpty
          >
            {data.map((stop) => (
              <MenuItem key={stop.atcoCode} value={stop.atcoCode}>
                {stop.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
    </Box>
  );
};
