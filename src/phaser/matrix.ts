import type { Font } from "@app/fonts";
import {
  makeMatrixBlank,
  makeMatrixCentre,
  makeCycleMatrix,
  makeMatrixForLayout,
  type Layout,
} from "@app/helpers";
import { first } from "@app/utils";

export class Matrix {
  private _data: string[] = [];
  private readonly _font: Font;
  private readonly _numCols: number;

  constructor(font: Font, numCols: number) {
    this._font = font;
    this._numCols = numCols;
    this._data = makeMatrixBlank(this._font, this._numCols);
  }

  get data(): string[] {
    return this._data;
  }

  needsScrollLeft(): boolean {
    const contentCols = first(this._data)?.length ?? 0;
    return contentCols > this._numCols;
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
