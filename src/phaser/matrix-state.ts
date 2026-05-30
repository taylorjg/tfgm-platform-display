import type { Font } from "@app/fonts";
import {
  makeMatrixBlank,
  makeMatrixCentre,
  makeCycleMatrix,
  makeMatrixForLayout,
  type Layout,
} from "@app/helpers";
import { first } from "@app/utils";

export class MatrixState {
  private readonly _font: Font;
  private readonly _numCols: number;
  private _data: string[] = [];

  constructor(font: Font, numCols: number) {
    this._font = font;
    this._numCols = numCols;
    this.makeMatrixBlank();
  }

  size(): { totalRows: number; totalCols: number } {
    const w = this._data[0]?.length ?? 0;
    const h = this._data.length;

    return {
      totalRows: h,
      totalCols: w + this._numCols,
    };
  }

  isDotOn(row: number, col: number): boolean {
    const s = this._data[row] ?? "";
    const ch = s.at(col);
    return ch === "x";
  }

  needsScrollLeft(): boolean {
    const contentCols = first(this._data)?.length ?? 0;
    return contentCols > this._numCols;
  }

  makeMatrixBlank() {
    this._data = makeMatrixBlank(this._font, this._numCols);
  }

  makeMatrixCentre(message: string) {
    this._data = makeMatrixCentre(this._font, this._numCols, message);
  }

  makeMatrixForLayout(layout: Layout, useFirstMessage: boolean) {
    this._data = makeMatrixForLayout(
      this._font,
      this._numCols,
      layout,
      useFirstMessage,
    );
  }

  makeCycleMatrix(layouts: Layout[], useFirstMessage: boolean) {
    this._data = makeCycleMatrix(
      this._font,
      this._numCols,
      layouts,
      useFirstMessage,
    );
  }
}
