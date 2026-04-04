import type { TramService } from "@app/hooks";

export const extractServiceColor = (service: TramService) => {
  const elements = service.id.split("_");

  if (elements.length === 2) {
    return elements[0].toLowerCase();
  }

  return "transparent";
};

export const extractServiceLocations = (service: TramService) => {
  const elements = service.name.split(" - ");

  console.assert(
    elements.length === 2,
    "Service name should have the format: <startLocation> - <endLocation>",
  );

  return {
    startLocation: elements[0],
    endLocation: elements[1],
  };
};
