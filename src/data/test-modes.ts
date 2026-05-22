import type { MessageDescriptor } from "@app/helpers";

const testMode1: MessageDescriptor[] = [
  {
    mode: "off",
  },
  {
    mode: "off",
  },
];

const testMode2: MessageDescriptor[] = [
  {
    mode: "single",
    layout: {
      type: "simple",
      message: {
        type: "spaceBetween",
        left: "Dartford Bra",
        right: "3 min",
      },
    },
  },
  {
    mode: "off",
  },
];

const testMode3: MessageDescriptor[] = [
  {
    mode: "single",
    layout: {
      type: "alternating",
      message1: {
        type: "left",
        text: "Dartford Bra",
      },
      message2: {
        type: "centre",
        text: "Approaching",
      },
    },
  },
  {
    mode: "cycle",
    layouts: [
      {
        type: "simple",
        message: {
          type: "spaceBetween",
          left: "Freckles",
          right: "dbl 7 min",
        },
      },
      {
        type: "simple",
        message: {
          type: "spaceBetween",
          left: "Dartford Bra",
          right: "11 min",
        },
      },
    ],
  },
];

const testMode4: MessageDescriptor[] = [
  {
    mode: "single",
    layout: {
      type: "simple",
      message: {
        type: "spaceBetween",
        left: "Dartford Bra",
        right: "dbl",
      },
    },
  },
  {
    mode: "cycle",
    layouts: [
      {
        type: "alternating",
        message1: {
          type: "left",
          text: "Freckles",
        },
        message2: {
          type: "centre",
          text: "Approaching",
        },
      },
      {
        type: "simple",
        message: {
          type: "spaceBetween",
          left: "Dartford Bra",
          right: "11 min",
        },
      },
      {
        type: "simple",
        message: {
          type: "spaceBetween",
          left: "Depot",
          right: "23 min",
        },
      },
    ],
  },
];

const testModes = [testMode1, testMode2, testMode3, testMode4];

export const testModesMap = new Map(
  testModes.map((testMode, index) => [index + 1, testMode]),
);
