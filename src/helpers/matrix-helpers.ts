import type { Font } from "@app/fonts";
import { first, isEven, range, sumBy } from "@app/utils";

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

const makeMessageMatrixSimple = (font: Font, message: string): string[] => {
  const chs = Array.from(message);
  const dotLinesPerCharacter = chs.map(lookupCharacter(font));
  return range(font.numVerticalDots).map((index) =>
    dotLinesPerCharacter.map((v) => v[index]).join(GAP),
  );
};

export const makeMessageMatrixCentred = (
  font: Font,
  numCols: number,
  message: string,
): string[] => {
  const matrix = makeMessageMatrixSimple(font, message);
  const matrixCols = first(matrix).length;
  const remainingCols = numCols - matrixCols;
  console.assert(remainingCols >= 0);
  const numLeftPaddingCols = Math.floor(remainingCols / 2);
  const numRightPaddingCols = remainingCols - numLeftPaddingCols;
  const leftPadding = " ".repeat(numLeftPaddingCols);
  const rightPadding = " ".repeat(numRightPaddingCols);
  return range(font.numVerticalDots).map(
    (index) => leftPadding + matrix[index] + rightPadding,
  );
};

const makeMessageMatrixSpaceBetween = (
  font: Font,
  numCols: number,
  leftText: string,
  rightText: string,
): string[] => {
  const leftMatrix = makeMessageMatrixSimple(font, leftText);
  const rightMatrix = makeMessageMatrixSimple(font, rightText);
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

export const makeMessageMatrix = (
  font: Font,
  numCols: number,
  message: string,
): string[] => {
  const parts = message.split("|");

  if (parts.length === 2) {
    const [leftText, rightText] = parts;
    return makeMessageMatrixSpaceBetween(font, numCols, leftText, rightText);
  }

  return makeMessageMatrixSimple(font, message);
};
