import type { LiveTram } from "@app/hooks";

export type Left = {
  type: "left";
  text: string;
};

export type Centre = {
  type: "centre";
  text: string;
};

export type SpaceBetween = {
  type: "spaceBetween";
  left: string;
  right: string;
};

export type Alignment = Left | Centre | SpaceBetween;

export type SimpleLayout = {
  type: "simple";
  message: Alignment;
};

export type AlternatingLayout = {
  type: "alternating";
  message1: Alignment;
  message2: Alignment;
};

export type Layout = SimpleLayout | AlternatingLayout;

export type OffRowDescriptor = {
  mode: "off";
};

export type SingleRowDescriptor = {
  mode: "single";
  layout: Layout;
};

export type CycleRowDescriptor = {
  mode: "cycle";
  layouts: Layout[];
};

export type ClockRowDescriptor = {
  mode: "clock";
};

export type RowDescriptor =
  | OffRowDescriptor
  | SingleRowDescriptor
  | CycleRowDescriptor
  | ClockRowDescriptor;

export type RowDescriptors = {
  row1: RowDescriptor;
  row2: RowDescriptor;
  row3: RowDescriptor;
};

export const makeTramAlignment = (tram: LiveTram): Alignment => {
  if (tram.status === "Approaching" || tram.status === "Arrived") {
    if (tram.carriages === "Double") {
      return {
        type: "spaceBetween",
        left: tram.destinationDisplay,
        right: "dbl",
      };
    }

    return {
      type: "left",
      text: tram.destinationDisplay,
    };
  }

  if (tram.status === "Due") {
    const carriages = tram.carriages === "Double" ? "dbl" : "";
    const due = `${tram.due} min`;
    const right = [carriages, due].filter(Boolean).join(" ");

    return {
      type: "spaceBetween",
      left: tram.destinationDisplay,
      right,
    };
  }

  return {
    type: "spaceBetween",
    left: tram.destinationDisplay,
    right: tram.status.toUpperCase(),
  };
};

export const makeTramLayout = (tram: LiveTram): Layout => {
  if (tram.status === "Approaching") {
    return {
      type: "alternating",
      message1: makeTramAlignment(tram),
      message2: {
        type: "centre",
        text: tram.status,
      },
    };
  }

  return {
    type: "simple",
    message: makeTramAlignment(tram),
  };
};

export const makeRow1Descriptor = (trams: LiveTram[]): RowDescriptor => {
  const [firstTram] = trams;

  if (firstTram) {
    return {
      mode: "single",
      layout: makeTramLayout(firstTram),
    };
  }

  return {
    mode: "off",
  };
};

export const makeRow2Descriptor = (trams: LiveTram[]): RowDescriptor => {
  const [, ...otherTrams] = trams;

  if (otherTrams.length === 0) {
    return {
      mode: "off",
    };
  }

  if (otherTrams.length === 1) {
    return {
      mode: "single",
      layout: makeTramLayout(otherTrams[0]),
    };
  }

  return {
    mode: "cycle",
    layouts: otherTrams.map(makeTramLayout),
  };
};

export const makeRow3Descriptor = (alert: string): RowDescriptor => {
  return {
    mode: "single",
    layout: {
      type: "simple",
      message: { type: "left", text: alert },
    },
  };
};

export const makeRowDescriptors = (
  trams: LiveTram[],
  alert: string,
): RowDescriptors => ({
  row1: makeRow1Descriptor(trams),
  row2: makeRow2Descriptor(trams),
  row3: makeRow3Descriptor(alert),
});
