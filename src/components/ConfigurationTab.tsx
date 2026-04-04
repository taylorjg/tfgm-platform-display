import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";

import { useConfiguration } from "@app/contexts";
import { useTramStops, type TramService, type TramStop } from "@app/hooks";
import { extractServiceColor, extractServiceLocations } from "@app/helpers";

export type ConfigurationTabProps = object;

const makeStartLocationsDirectionLabel = (selectedServices: TramService[]) => {
  return selectedServices
    .map((service) => extractServiceLocations(service).startLocation)
    .join(", ");
};

const makeEndLocationsDirectionLabel = (selectedServices: TramService[]) => {
  return selectedServices
    .map((service) => extractServiceLocations(service).endLocation)
    .join(", ");
};

export const ConfigurationTab = () => {
  const { configuration, setConfiguration } = useConfiguration();
  const { data, isPending, isError, error } = useTramStops();
  const [selectedTramStop, setSelectedTramStop] = useState<TramStop | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState<TramService[]>([]);
  const [towards, setTowards] = useState<"starts" | "ends" | null>(null);

  useEffect(() => {
    if (data && configuration) {
      const stop =
        data.find((s) => s.atcoCode === configuration.tramStopAtcoCode) ?? null;
      if (stop) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedTramStop(stop);
        setSelectedServices(
          stop.services.filter((s) => configuration.serviceIds.includes(s.id)),
        );
        setTowards(configuration.towards);
      }
    }
  }, [configuration, data]);

  const handleTramStopChange = (event: SelectChangeEvent<string>) => {
    const atcoCode = event.target.value;
    const stop = data?.find((s) => s.atcoCode === atcoCode) ?? null;
    setSelectedTramStop(stop);
    setSelectedServices([]);
    setTowards(null);
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

  const onSave = () => {
    setConfiguration({
      tramStopAtcoCode: selectedTramStop?.atcoCode ?? "",
      serviceIds: selectedServices.map((s) => s.id),
      towards: towards!,
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

  const canSave =
    selectedTramStop && selectedServices.length > 0 && towards !== null;

  return (
    <Stack
      role="tabpanel"
      id="configuration-tabpanel"
      aria-labelledby="configuration-tab"
      spacing={2}
      useFlexGap
    >
      <FormControl fullWidth>
        <InputLabel id="tram-stop-select-label">Tram stop</InputLabel>
        <Select
          labelId="tram-stop-select-label"
          id="tram-stop-select"
          label="Tram stop"
          value={selectedTramStop?.atcoCode ?? ""}
          onChange={handleTramStopChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((stop) => (
            <MenuItem key={stop.atcoCode} value={stop.atcoCode}>
              {stop.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedTramStop && (
        <Box>
          <Typography variant="subtitle2" component="p" sx={{ mb: 1 }}>
            Services
          </Typography>
          <FormGroup>
            {selectedTramStop.services.map((service) => (
              <FormControlLabel
                key={service.id}
                control={
                  <Checkbox
                    checked={selectedServices.some((s) => s.id === service.id)}
                    onChange={() => handleServiceToggle(service)}
                  />
                }
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: extractServiceColor(service),
                        width: 40,
                        height: 8,
                      }}
                    />
                    &nbsp;
                    {service.name}
                  </div>
                }
              />
            ))}
          </FormGroup>
        </Box>
      )}

      {selectedServices.length > 0 && (
        <Box>
          <Typography
            id="towards-label"
            variant="subtitle2"
            component="p"
            sx={{ mb: 1 }}
          >
            Towards
          </Typography>
          <RadioGroup
            aria-labelledby="towards-label"
            name="towards"
            value={towards}
            onChange={(e) => setTowards(e.target.value as "starts" | "ends")}
          >
            <FormControlLabel
              value="starts"
              control={<Radio size="small" />}
              label={makeStartLocationsDirectionLabel(selectedServices)}
            />
            <FormControlLabel
              value="ends"
              control={<Radio size="small" />}
              label={makeEndLocationsDirectionLabel(selectedServices)}
            />
          </RadioGroup>
        </Box>
      )}

      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!canSave} onClick={onSave}>
          Save
        </Button>
      </Box>
    </Stack>
  );
};
