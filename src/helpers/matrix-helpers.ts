import type { Font } from "@app/fonts";

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

export const makeMessageMatrix = (font: Font, message: string): string[] => {
  const matrix: string[] = Array(font.numVerticalDots).fill("");
  const chs = Array.from(message);
  for (const ch of chs) {
    appendCharacterToMatrix(font, matrix, ch);
  }
  return matrix;
};
