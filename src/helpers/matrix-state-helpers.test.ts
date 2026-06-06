/* eslint-disable prettier/prettier */

import { describe, expect, it, vi } from "vitest";

import { clockFont } from "@app/fonts";
import type { Font } from "@app/fonts";

import {
  makeCycleMatrix,
  makeMatrixBlank,
  makeMatrixCentre,
  makeMatrixForAlignment,
  makeMatrixForLayout,
  makeRowMatrixWithBlankLine,
} from "./matrix-state-helpers.ts";

const testFont: Font = {
  name: "test",
  numVerticalDots: 3,
  fontMap: new Map([
    ["A", { dotLines: [
      "xx",
      "xx",
      "xx",
    ] }],
    ["B", { dotLines: [
      "x ",
      " x",
      "x ",
    ] }],
  ]),
};

describe("makeMatrixBlank", () => {
  it("returns blank rows matching the font height and column count", () => {
    expect(makeMatrixBlank(testFont, 5)).toEqual([
      "     ",
      "     ",
      "     ",
    ]);
  });
});

describe("makeMatrixCentre", () => {
  it("centres a short message within the available columns", () => {
    expect(makeMatrixCentre(testFont, 8, "A")).toEqual([
      "   xx",
      "   xx",
      "   xx",
    ]);
  });

  it("centres clock text using the real clock font", () => {
    const matrix = makeMatrixCentre(clockFont, 20, "1");

    expect(matrix).toHaveLength(clockFont.numVerticalDots);
    expect(matrix.every((row) => row.length <= 20)).toBe(true);
    expect(matrix.some((row) => row.includes("x"))).toBe(true);
    expect(matrix[0]?.startsWith(" ")).toBe(true);
  });
});

describe("makeMatrixForAlignment", () => {
  it("returns left-aligned text without extra padding", () => {
    expect(
      makeMatrixForAlignment(testFont, 10, {
        type: "left",
        text: "A",
      }),
    ).toEqual([
      "xx",
      "xx",
      "xx",
    ]);
  });

  it("returns centred text", () => {
    expect(
      makeMatrixForAlignment(testFont, 8, {
        type: "centre",
        text: "A",
      }),
    ).toEqual([
      "   xx",
      "   xx",
      "   xx",
    ]);
  });

  it("returns spaceBetween text with padding between sides", () => {
    expect(
      makeMatrixForAlignment(testFont, 10, {
        type: "spaceBetween",
        left: "A",
        right: "B",
      }),
    ).toEqual([
      "xx      x ",
      "xx       x",
      "xx      x ",
    ]);
  });
});

describe("makeMatrixForLayout", () => {
  it("returns a simple layout", () => {
    expect(
      makeMatrixForLayout(testFont, 10, {
        type: "simple",
        message: { type: "left", text: "A" },
      }),
    ).toEqual([
      "xx",
      "xx",
      "xx",
    ]);
  });

  it("uses the first alternating message by default", () => {
    expect(
      makeMatrixForLayout(testFont, 10, {
        type: "alternating",
        message1: { type: "left", text: "A" },
        message2: { type: "left", text: "B" },
      }),
    ).toEqual([
      "xx",
      "xx",
      "xx",
    ]);
  });

  it("uses the second alternating message when requested", () => {
    expect(
      makeMatrixForLayout(
        testFont,
        10,
        {
          type: "alternating",
          message1: { type: "left", text: "A" },
          message2: { type: "left", text: "B" },
        },
        false,
      ),
    ).toEqual([
      "x ",
      " x",
      "x ",
    ]);
  });
});

describe("makeCycleMatrix", () => {
  it("concatenates each layout matrix in order", () => {
    expect(
      makeCycleMatrix(
        testFont,
        10,
        [
          {
            type: "simple",
            message: { type: "left", text: "A" },
          },
          {
            type: "simple",
            message: { type: "left", text: "B" },
          },
        ],
      ),
    ).toEqual([
      "xx",
      "xx",
      "xx",
      "x ",
      " x",
      "x ",
    ]);
  });
});

describe("makeRowMatrixWithBlankLine", () => {
  it("prepends a blank line before an off row", () => {
    expect(makeRowMatrixWithBlankLine(testFont, 5, { mode: "off" })).toEqual([
      "     ",
      "     ",
      "     ",
      "     ",
      "     ",
      "     ",
    ]);
  });

  it("prepends a blank line before a single row", () => {
    expect(
      makeRowMatrixWithBlankLine(testFont, 5, {
        mode: "single",
        layout: {
          type: "simple",
          message: { type: "left", text: "A" },
        },
      }),
    ).toEqual([
      "     ",
      "     ",
      "     ",
      "xx",
      "xx",
      "xx",
    ]);
  });

  it("prepends a blank line before the first layout of a cycle row", () => {
    expect(
      makeRowMatrixWithBlankLine(testFont, 5, {
        mode: "cycle",
        layouts: [
          {
            type: "simple",
            message: { type: "left", text: "A" },
          },
          {
            type: "simple",
            message: { type: "left", text: "B" },
          },
        ],
      }),
    ).toEqual([
      "     ",
      "     ",
      "     ",
      "xx",
      "xx",
      "xx",
    ]);
  });
});

describe("missing characters", () => {
  it("uses a chequered fallback and warns when a character is missing", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const matrix = makeMatrixForAlignment(testFont, 10, {
      type: "left",
      text: "?",
    });

    expect(warnSpy).toHaveBeenCalledWith(
      'Character "?" not found in fontMap for font "test".',
    );
    expect(matrix).toHaveLength(3);
    expect(matrix).toEqual([
      "x ",
      " x",
      "x ",
    ]);

    warnSpy.mockRestore();
  });
});
