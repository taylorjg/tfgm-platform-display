import { rowFontMap } from "./row-font";
import { clockFontMap } from "./clock-font";
import { makeFont } from "./utils";

export * from "./types";

export const rowFont = makeFont(rowFontMap, "Row Font");
export const clockFont = makeFont(clockFontMap, "Clock Font");
