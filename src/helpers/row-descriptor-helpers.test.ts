import type { LiveTram } from "@app/hooks";

import {
  makeRow1Descriptor,
  makeRow2Descriptor,
  makeRow3Descriptor,
  makeTramAlignment,
  makeTramLayout,
} from "./row-descriptor-helpers.ts";

const makeTram = (
  overrides: Partial<LiveTram> &
    Pick<LiveTram, "destinationDisplay" | "status">,
): LiveTram => ({
  carriages: "Single",
  due: 0,
  ...overrides,
});

describe("makeTramAlignment", () => {
  it("returns left alignment for an approaching single tram", () => {
    expect(
      makeTramAlignment(
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Approaching",
        }),
      ),
    ).toEqual({
      type: "left",
      text: "Piccadilly",
    });
  });

  it("returns spaceBetween with dbl for an approaching double tram", () => {
    expect(
      makeTramAlignment(
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Approaching",
          carriages: "Double",
        }),
      ),
    ).toEqual({
      type: "spaceBetween",
      left: "Piccadilly",
      right: "dbl",
    });
  });

  it("returns left alignment for an arrived single tram", () => {
    expect(
      makeTramAlignment(
        makeTram({
          destinationDisplay: "Victoria",
          status: "Arrived",
        }),
      ),
    ).toEqual({
      type: "left",
      text: "Victoria",
    });
  });

  it("returns spaceBetween with due time for a due single tram", () => {
    expect(
      makeTramAlignment(
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Due",
          due: 5,
        }),
      ),
    ).toEqual({
      type: "spaceBetween",
      left: "Piccadilly",
      right: "5 min",
    });
  });

  it("returns spaceBetween with dbl and due time for a due double tram", () => {
    expect(
      makeTramAlignment(
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Due",
          carriages: "Double",
          due: 7,
        }),
      ),
    ).toEqual({
      type: "spaceBetween",
      left: "Piccadilly",
      right: "dbl 7 min",
    });
  });

  it("returns spaceBetween with uppercased status for other statuses", () => {
    expect(
      makeTramAlignment(
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Cancelled",
        }),
      ),
    ).toEqual({
      type: "spaceBetween",
      left: "Piccadilly",
      right: "CANCELLED",
    });
  });
});

describe("makeTramLayout", () => {
  it("returns alternating layout for approaching trams", () => {
    expect(
      makeTramLayout(
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Approaching",
        }),
      ),
    ).toEqual({
      type: "alternating",
      message1: {
        type: "left",
        text: "Piccadilly",
      },
      message2: {
        type: "centre",
        text: "Approaching",
      },
    });
  });

  it("returns simple layout for non-approaching trams", () => {
    expect(
      makeTramLayout(
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Due",
          due: 3,
        }),
      ),
    ).toEqual({
      type: "simple",
      message: {
        type: "spaceBetween",
        left: "Piccadilly",
        right: "3 min",
      },
    });
  });
});

describe("makeRow1Descriptor", () => {
  it("returns off when there are no trams", () => {
    expect(makeRow1Descriptor([])).toEqual({ mode: "off" });
  });

  it("returns a single layout for the first tram", () => {
    expect(
      makeRow1Descriptor([
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Due",
          due: 2,
        }),
      ]),
    ).toEqual({
      mode: "single",
      layout: {
        type: "simple",
        message: {
          type: "spaceBetween",
          left: "Piccadilly",
          right: "2 min",
        },
      },
    });
  });
});

describe("makeRow2Descriptor", () => {
  it("returns off when there is only one tram", () => {
    expect(
      makeRow2Descriptor([
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Due",
          due: 2,
        }),
      ]),
    ).toEqual({ mode: "off" });
  });

  it("returns off when there are no trams", () => {
    expect(makeRow2Descriptor([])).toEqual({ mode: "off" });
  });

  it("returns a single layout when there is one additional tram", () => {
    expect(
      makeRow2Descriptor([
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Due",
          due: 2,
        }),
        makeTram({
          destinationDisplay: "Victoria",
          status: "Due",
          due: 5,
        }),
      ]),
    ).toEqual({
      mode: "single",
      layout: {
        type: "simple",
        message: {
          type: "spaceBetween",
          left: "Victoria",
          right: "5 min",
        },
      },
    });
  });

  it("returns a cycle layout when there are multiple additional trams", () => {
    expect(
      makeRow2Descriptor([
        makeTram({
          destinationDisplay: "Piccadilly",
          status: "Due",
          due: 2,
        }),
        makeTram({
          destinationDisplay: "Victoria",
          status: "Due",
          due: 5,
        }),
        makeTram({
          destinationDisplay: "Bury",
          status: "Approaching",
        }),
      ]),
    ).toEqual({
      mode: "cycle",
      layouts: [
        {
          type: "simple",
          message: {
            type: "spaceBetween",
            left: "Victoria",
            right: "5 min",
          },
        },
        {
          type: "alternating",
          message1: {
            type: "left",
            text: "Bury",
          },
          message2: {
            type: "centre",
            text: "Approaching",
          },
        },
      ],
    });
  });
});

describe("makeRow3Descriptor", () => {
  it("returns a left-aligned simple layout for the alert text", () => {
    expect(makeRow3Descriptor("Service disruption")).toEqual({
      mode: "single",
      layout: {
        type: "simple",
        message: {
          type: "left",
          text: "Service disruption",
        },
      },
    });
  });
});
