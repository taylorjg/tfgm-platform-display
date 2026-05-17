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

export type OffMessageDescriptor = {
  mode: "off";
};

export type SingleMessageDescriptor = {
  mode: "single";
  layout: Layout;
};

export type CyclingMessageDescriptor = {
  mode: "cycling";
  layouts: Layout[];
};

export type ClockMessageDescriptor = {
  mode: "clock";
};

export type MessageDescriptor =
  | OffMessageDescriptor
  | SingleMessageDescriptor
  | CyclingMessageDescriptor
  | ClockMessageDescriptor;

// export const makeApproachingTramAlignment = (tram: LiveTram): Alignment => {
//   if (tram.carriages === "Double") {
//     return {
//       type: "spaceBetween",
//       left: tram.destinationDisplay,
//       right: "dbl",
//     };
//   }

//   return {
//     type: "left",
//     text: tram.destinationDisplay,
//   };
// };

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

export const makeMessageDescriptors = (
  trams: LiveTram[],
): MessageDescriptor[] => {
  const messageDescriptors: MessageDescriptor[] = [];

  const [firstTram, ...otherTrams] = trams;

  if (firstTram) {
    messageDescriptors.push({
      mode: "single",
      layout: makeTramLayout(firstTram),
    });
  } else {
    messageDescriptors.push({
      mode: "off",
    });
  }

  if (otherTrams.length === 0) {
    messageDescriptors.push({
      mode: "off",
    });
  }

  if (otherTrams.length === 1) {
    messageDescriptors.push({
      mode: "single",
      layout: makeTramLayout(otherTrams[0]),
    });
  }

  if (otherTrams.length > 1) {
    messageDescriptors.push({
      mode: "cycling",
      layouts: otherTrams.map(makeTramLayout),
    });
  }

  return messageDescriptors;
};
