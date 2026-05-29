import type { TramService } from "@app/hooks";

const nameToRgba = (name: string): string => {
  // Create a temporary HTML element
  const el = document.createElement("div");
  el.style.color = name;
  document.body.appendChild(el);

  // Get the computed color (returns format like "rgb(255, 99, 71)")
  const rgbStr = getComputedStyle(el).color;
  document.body.removeChild(el);

  // Convert to RGBA by replacing "rgb" with "rgba" and adding an alpha channel
  return rgbStr.replace("rgb", "rgba").replace(")", ", 0.5)");
};

export const extractServiceColor = (service: TramService): string => {
  const elements = service.id.split("_");

  if (elements.length === 2) {
    const color = elements[0];
    return nameToRgba(color);
  }

  return "rgba(0, 0, 0, 0)";
};

export const extractServiceLocations = (
  service: TramService,
): { startLocation: string; endLocation: string } => {
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
