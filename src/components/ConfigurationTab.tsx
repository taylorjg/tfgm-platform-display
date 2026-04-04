import { useState } from "react";
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";

import { useTramStops, type TramService, type TramStop } from "@app/hooks";

export type ConfigurationTabProps = {
  hidden: boolean;
};

export const ConfigurationTab = ({ hidden }: ConfigurationTabProps) => {
  const { data, isPending, isError, error } = useTramStops();
  const [selectedTramStop, setSelectedTramStop] = useState<TramStop | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState<TramService[]>([]);

  console.log({ selectedTramStop, selectedServices });

  const handleTramStopChange = (event: SelectChangeEvent<string>) => {
    const atcoCode = event.target.value;
    const stop = data?.find((s) => s.atcoCode === atcoCode) ?? null;
    setSelectedTramStop(stop);
    setSelectedServices([]);
  };

  const handleServiceToggle = (service: TramService) => {
    setSelectedServices((prev) => {
      // Are we removing this service ?
      if (prev.some((s) => s.id === service.id)) {
        return prev.filter((s) => s.id !== service.id);
      }

      // No so we must be adding this service
      return [...prev, service];
    });
  };

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} aria-label="Loading tram stops" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : "Failed to load tram stops"}
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No tram stops found.
      </Typography>
    );
  }

  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      id="side-panel-tabpanel-0"
      aria-labelledby="side-panel-tab-0"
      sx={{ minHeight: 0 }}
    >
      <FormControl fullWidth size="small">
        <InputLabel id="tram-stop-select-label" shrink>
          Tram stop
        </InputLabel>
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

      {selectedTramStop && selectedTramStop.services.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" component="p" sx={{ mb: 1 }}>
            Services
          </Typography>
          <FormGroup>
            {selectedTramStop.services.map((service) => (
              <FormControlLabel
                key={service.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedServices.some((s) => s.id === service.id)}
                    onChange={() => handleServiceToggle(service)}
                  />
                }
                label={service.name}
              />
            ))}
          </FormGroup>
        </Box>
      ) : null}
    </Box>
  );
};
