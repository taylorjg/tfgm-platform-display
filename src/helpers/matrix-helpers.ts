import type { Font } from "@app/fonts";
import { range } from "@app/utils";

const appendCharacterToMatrix = (font: Font, matrix: string[], ch: string) => {
  const value = font.fontMap.get(ch);

  if (!value) {
    console.warn(
      `Character "${ch}" not found in fontMap for font "${font.name}".`,
    );
    return;
  }

  const { start, length } = value;

  matrix.forEach((matrixLine, index) => {
    const characterLine = (value.lines[index] ?? "").slice(
      start,
      start + length,
    );
    const gap = matrixLine ? " " : "";
    const newMatrixLine = matrixLine + gap + characterLine;
    matrix[index] = newMatrixLine;
  });
};

const makeMessageMatrixTwoParts = (
  font: Font,
  numCols: number,
  leftText: string,
  rightText: string,
): string[] => {
  const leftMatrix = makeMessageMatrix(font, numCols, leftText);
  const rightMatrix = makeMessageMatrix(font, numCols, rightText);
  const leftMatrixCols = leftMatrix[0].length;
  const rightMatrixCols = rightMatrix[0].length;
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
    return makeMessageMatrixTwoParts(font, numCols, leftText, rightText);
  }

  const matrix = Array(font.numVerticalDots).fill("");

  const chs = Array.from(message);
  for (const ch of chs) {
    appendCharacterToMatrix(font, matrix, ch);
  }

  return matrix;
};
