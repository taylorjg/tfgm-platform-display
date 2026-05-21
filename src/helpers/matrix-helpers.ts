import type { Font } from "@app/fonts";
import { first, isEven, range, sumBy } from "@app/utils";
import type { Alignment, Layout } from "./message-descriptor-helpers";

const makeChequeredPattern = (width: number, rowIndex: number): string => {
  return range(width)
    .map((colIndex) => (isEven(rowIndex + colIndex) ? "x" : " "))
    .join("");
};

const makeMissingCharacterDotGrid = (font: Font): string[] => {
  const values = Array.from(font.fontMap.values());
  const totalWidths = sumBy(values, (value) => value.dotLines[0].length);
  const averageWidth = Math.ceil(totalWidths / values.length);
  return range(font.numVerticalDots).map((rowIndex) =>
    makeChequeredPattern(averageWidth, rowIndex),
  );
};

const lookupCharacter =
  (font: Font) =>
  (ch: string): string[] => {
    const value = font.fontMap.get(ch);

    if (!value) {
      console.warn(
        `Character "${ch}" not found in fontMap for font "${font.name}".`,
      );
      return makeMissingCharacterDotGrid(font);
    }

    return value.dotLines;
  };

const GAP = " ";

export const makeMatrixBlank = (font: Font, numCols: number): string[] => {
  return range(font.numVerticalDots).map(() => " ".repeat(numCols));
};

const makeMatrixLeft = (font: Font, message: string): string[] => {
  const chs = Array.from(message);
  const dotLinesPerCharacter = chs.map(lookupCharacter(font));
  return range(font.numVerticalDots).map((index) =>
    dotLinesPerCharacter.map((v) => v[index]).join(GAP),
  );
};

export const makeMatrixCentre = (
  font: Font,
  numCols: number,
  message: string,
): string[] => {
  const matrix = makeMatrixLeft(font, message);
  const matrixCols = first(matrix).length;
  const remainingCols = numCols - matrixCols;
  console.assert(remainingCols >= 0);
  const numLeftPaddingCols = Math.floor(remainingCols / 2);
  const leftPadding = " ".repeat(numLeftPaddingCols);
  return range(font.numVerticalDots).map(
    (index) => leftPadding + matrix[index],
  );
};

const makeMatrixSpaceBetween = (
  font: Font,
  numCols: number,
  leftText: string,
  rightText: string,
): string[] => {
  const leftMatrix = makeMatrixLeft(font, leftText);
  const rightMatrix = makeMatrixLeft(font, rightText);
  const leftMatrixCols = first(leftMatrix).length;
  const rightMatrixCols = first(rightMatrix).length;
  const spaceBetweenCols = numCols - leftMatrixCols - rightMatrixCols;

  console.assert(spaceBetweenCols >= 0);

  const spaceBetween = " ".repeat(spaceBetweenCols);

  const matrix = range(font.numVerticalDots).map(
    (index) => leftMatrix[index] + spaceBetween + rightMatrix[index],
  );

  return matrix;
};

export const makeMatrixForAlignment = (
  font: Font,
  numCols: number,
  alignment: Alignment,
): string[] => {
  switch (alignment.type) {
    case "left":
      return makeMatrixLeft(font, alignment.text);
    case "centre":
      return makeMatrixCentre(font, numCols, alignment.text);
    case "spaceBetween":
      return makeMatrixSpaceBetween(
        font,
        numCols,
        alignment.left,
        alignment.right,
      );
  }
};

export const makeMatrixForLayout = (
  font: Font,
  numCols: number,
  layout: Layout,
  useFirstMessage: boolean = true,
): string[] => {
  switch (layout.type) {
    case "simple":
      return makeMatrixForAlignment(font, numCols, layout.message);
    case "alternating":
      return makeMatrixForAlignment(
        font,
        numCols,
        useFirstMessage ? layout.message1 : layout.message2,
      );
  }
};

export const makeCycleMatrix = (
  font: Font,
  numCols: number,
  layouts: Layout[],
  useFirstMessage: boolean = true,
): string[] => {
  return layouts
    .map((layout) =>
      makeMatrixForLayout(font, numCols, layout, useFirstMessage),
    )
    .flat();
};
