import { useState } from "react";
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

import type { Configuration } from "@app/contexts";
import { useConfiguration } from "@app/contexts";
import { useTramStops, type TramService, type TramStop } from "@app/hooks";
import { extractServiceColor, extractServiceLocations } from "@app/helpers";

const makeLocationsDirectionLabel = (
  selectedServices: TramService[],
  selector: ({
    startLocation,
    endLocation,
  }: {
    startLocation: string;
    endLocation: string;
  }) => string,
) => {
  const locations = selectedServices.map((service) =>
    selector(extractServiceLocations(service)),
  );
  return locations.length === 1 ? locations[0] : `${locations[0]} etc.`;
};

const makeStartLocationsDirectionLabel = (selectedServices: TramService[]) => {
  return makeLocationsDirectionLabel(
    selectedServices,
    (locations) => locations.startLocation,
  );
};

const makeEndLocationsDirectionLabel = (selectedServices: TramService[]) => {
  return makeLocationsDirectionLabel(
    selectedServices,
    (locations) => locations.endLocation,
  );
};

const sortSelectedServices = (
  allServices: TramService[],
  selectedServices: TramService[],
) => {
  return selectedServices.sort((a, b) => {
    const aIndex = allServices.indexOf(a);
    const bIndex = allServices.indexOf(b);
    return aIndex - bIndex;
  });
};

const nullFormState = {
  selectedTramStop: null as TramStop | null,
  selectedServices: [] as TramService[],
  towards: null as "starts" | "ends" | null,
};

const getInitialFormState = (
  tramsStops: TramStop[],
  configuration: Configuration | null,
) => {
  if (!configuration) return nullFormState;

  const tramStop =
    tramsStops.find((s) => s.atcoCode === configuration.atcoCode) ?? null;

  if (!tramStop) return nullFormState;

  return {
    selectedTramStop: tramStop,
    selectedServices: tramStop.services.filter((s) =>
      configuration.serviceIds.includes(s.id),
    ),
    towards: configuration.towards,
  };
};

type ConfigurationFormProps = {
  tramStops: TramStop[];
  configuration: Configuration | null;
  setConfiguration: (configuration: Configuration) => void;
  onClose: () => void;
};

const ConfigurationForm = ({
  tramStops,
  configuration,
  setConfiguration,
  onClose,
}: ConfigurationFormProps) => {
  const initialFormState = getInitialFormState(tramStops, configuration);
  const [selectedTramStop, setSelectedTramStop] = useState(
    initialFormState.selectedTramStop,
  );
  const [selectedServices, setSelectedServices] = useState(
    initialFormState.selectedServices,
  );
  const [towards, setTowards] = useState(initialFormState.towards);

  const handleTramStopChange = (event: SelectChangeEvent<string>) => {
    const atcoCode = event.target.value;
    const stop = tramStops.find((s) => s.atcoCode === atcoCode) ?? null;
    setSelectedTramStop(stop);
    setSelectedServices([]);
    setTowards(null);
  };

  const handleServiceToggle = (service: TramService) => {
    setSelectedServices((prev) => {
      // Is the service already selected ??
      if (prev.some((s) => s.id === service.id)) {
        // Yes - remove it
        return prev.filter((s) => s.id !== service.id);
      }

      // No - add it
      const newServices = [...prev, service];

      return selectedTramStop
        ? sortSelectedServices(selectedTramStop.services, newServices)
        : newServices;
    });
  };

  const onSave = () => {
    setConfiguration({
      atcoCode: selectedTramStop?.atcoCode ?? "",
      serviceIds: selectedServices.map((s) => s.id),
      towards: towards!,
    });
    onClose();
  };

  const canSave =
    Boolean(selectedTramStop) &&
    selectedServices.length > 0 &&
    towards !== null;

  return (
    <Stack
      role="tabpanel"
      id="configuration-tabpanel"
      aria-labelledby="configuration-tab"
      spacing={2}
      useFlexGap
    >
      <FormControl fullWidth>
        <InputLabel id="tram-stop-select-label">Tram Stop</InputLabel>
        <Select
          labelId="tram-stop-select-label"
          id="tram-stop-select"
          label="Tram Stop"
          value={selectedTramStop?.atcoCode ?? ""}
          onChange={handleTramStopChange}
          // https://github.com/mui/material-ui/issues/34656
          MenuProps={{ PaperProps: { sx: { maxHeight: 350 } } }}
        >
          {tramStops.map(({ atcoCode, name }) => (
            <MenuItem key={atcoCode} value={atcoCode}>
              {name}
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
                  <Typography
                    variant="body2"
                    style={{
                      backgroundColor: extractServiceColor(service),
                    }}
                    sx={{ p: 0.5 }}
                  >
                    {service.name}
                  </Typography>
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

export type ConfigurationTabProps = {
  onClose: () => void;
};

export const ConfigurationTab = ({ onClose }: ConfigurationTabProps) => {
  const { configuration, setConfiguration } = useConfiguration();
  const { data: tramStops, isPending, isError, error } = useTramStops();

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

  if (tramStops.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No tram stops found.
      </Typography>
    );
  }

  const formKey = JSON.stringify(configuration ?? "none");

  return (
    <ConfigurationForm
      key={formKey}
      tramStops={tramStops}
      configuration={configuration}
      setConfiguration={setConfiguration}
      onClose={onClose}
    />
  );
};
