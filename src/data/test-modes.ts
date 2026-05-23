import type { LiveTram } from "@app/hooks";

const testMode1: LiveTram[] = [
  // no trams
];

const testMode2: LiveTram[] = [
  {
    carriages: "Single",
    destinationDisplay: "Dartford Bra",
    status: "Due",
    due: 3,
  },
];

const testMode3: LiveTram[] = [
  {
    carriages: "Single",
    destinationDisplay: "Dartford Bra",
    status: "Approaching",
    due: 0,
  },
  {
    carriages: "Double",
    destinationDisplay: "Freckles",
    status: "Due",
    due: 7,
  },
  {
    carriages: "Single",
    destinationDisplay: "Dartford Bra",
    status: "Due",
    due: 11,
  },
];

const testMode4: LiveTram[] = [
  {
    carriages: "Double",
    destinationDisplay: "Dartford Bra",
    status: "Arrived",
    due: 0,
  },
  {
    carriages: "Single",
    destinationDisplay: "Freckles",
    status: "Approaching",
    due: 0,
  },
  {
    carriages: "Double",
    destinationDisplay: "Dartford Bra",
    status: "Due",
    due: 11,
  },
  {
    carriages: "Single",
    destinationDisplay: "Depot",
    status: "Due",
    due: 23,
  },
];

const testModes = [testMode1, testMode2, testMode3, testMode4];

export const testModesMap = new Map(
  testModes.map((testMode, index) => [index + 1, testMode]),
);
