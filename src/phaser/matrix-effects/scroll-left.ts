import type { Dimensions } from "../scene";

import type { MatrixEffect } from "./types";

const DOTS_PER_SECOND = 50;
const DOTS_PER_MS = DOTS_PER_SECOND / 1000;

export class ScrollLeft implements MatrixEffect {
  #dimensions: Dimensions;
  #offset = 0;

  constructor(dimensions: Dimensions) {
    this.#dimensions = dimensions;
  }

  tick(deltaMs: number) {
    this.#offset += Math.round(deltaMs * DOTS_PER_MS);
  }

  nextRowCol(row: number, col: number) {
    return {
      row,
      col: (col + this.#offset) % this.#dimensions.wrapAtCol,
    };
  }
}
