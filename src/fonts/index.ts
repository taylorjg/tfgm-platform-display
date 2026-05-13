import { fontMap1 } from "./font1";
import { fontMap2 } from "./font2";
import type { CharacterDescriptor } from "./utils";

export type Font = {
  name: string;
  fontMap: Map<string, CharacterDescriptor>;
  numVerticalDots: number;
};

export const fonts: Font[] = [
  {
    name: "Font 1",
    fontMap: fontMap1,
    numVerticalDots: fontMap1.values().next().value?.dotLines.length ?? 0,
  },
  {
    name: "Font 2",
    fontMap: fontMap2,
    numVerticalDots: fontMap2.values().next().value?.dotLines.length ?? 0,
  },
];
