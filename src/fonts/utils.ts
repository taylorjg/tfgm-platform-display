import { first, last, range } from "@app/utils";

const BREAK = "|";

const findBreaks = (lastDotLine: string): number[] => {
  const breaks = [0];
  const numDots = lastDotLine.length;

  for (const dotIndex of range(numDots)) {
    if (lastDotLine[dotIndex] === BREAK) {
      breaks.push(dotIndex + 1);
    }
  }

  return breaks;
};

export type CharacterDescriptor = {
  dotLines: string[];
};

export type FontMapKvp = [string, CharacterDescriptor];

export const makeFontMapKvps = (
  characters: string,
  dotData: string,
): FontMapKvp[] => {
  const dotLines = dotData.split("\n").filter(Boolean);
  const firstDotLine = first(dotLines);
  const numDots = firstDotLine.length;

  console.assert(dotLines.every((dotLine) => dotLine.length === numDots));

  const chs = Array.from(characters);
  const breaks = findBreaks(last(dotLines));
  console.assert(breaks.length === chs.length);

  return chs.map((ch, index) => {
    const startIndex = breaks[index];
    const endIndex = breaks[index + 1] ?? numDots + 1;
    const characterDotLines = dotLines.map((dotLine) =>
      dotLine.slice(startIndex, endIndex - 1),
    );
    return [ch, { dotLines: characterDotLines }];
  });
};
