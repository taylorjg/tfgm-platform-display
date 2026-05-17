import type { Font } from "@app/fonts";
import { first, isEven, range, sumBy } from "@app/utils";
import type {
  Alignment,
  Layout,
  MessageDescriptor,
} from "./message-descriptor-helpers";

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
  const numRightPaddingCols = remainingCols - numLeftPaddingCols;
  const leftPadding = " ".repeat(numLeftPaddingCols);
  const rightPadding = " ".repeat(numRightPaddingCols);
  return range(font.numVerticalDots).map(
    (index) => leftPadding + matrix[index] + rightPadding,
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

export const makeMessageMatrix = (
  font: Font,
  numCols: number,
  message: string,
): string[] => {
  const parts = message.split("|");

  if (parts.length === 2) {
    const [leftText, rightText] = parts;
    return makeMatrixSpaceBetween(font, numCols, leftText, rightText);
  }

  return makeMatrixLeft(font, message);
};

const makeMatrixForAlignment = (
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

const makeMatrixForLayout = (
  font: Font,
  numCols: number,
  layout: Layout,
): string[] => {
  switch (layout.type) {
    case "simple":
      return makeMatrixForAlignment(font, numCols, layout.message);
    case "alternating":
      return makeMatrixForAlignment(font, numCols, layout.message1);
  }
};

export const makeMatrixForMessageDescriptor = (
  font: Font,
  numCols: number,
  messageDescriptor: MessageDescriptor,
): string[] => {
  switch (messageDescriptor.mode) {
    case "single":
      return makeMatrixForLayout(font, numCols, messageDescriptor.layout);
    case "cycling":
      return makeMatrixForLayout(font, numCols, messageDescriptor.layouts[0]);
  }

  return makeMatrixBlank(font, numCols);
};
