import Phaser from "phaser";

import type { Font } from "@app/fonts";
import { formatTime, type MessageDescriptor } from "@app/helpers";

import { Dots, type Dimensions } from "./dots";
import { Matrix } from "./matrix";

export class MatrixRow {
  private readonly _scene: Phaser.Scene;
  private _font: Font;
  private _dimensions: Dimensions;
  private _matrix: Matrix;
  private _dots!: Dots;
  private _includeFirstColon = false;
  private _rowOffset = 0;
  private _colOffset = 0;

  constructor(scene: Phaser.Scene, font: Font, dimensions: Dimensions) {
    this._scene = scene;
    this._font = font;
    this._dimensions = dimensions;
    this._matrix = new Matrix(font, dimensions.numCols);
    this._matrix.makeMatrixBlank();
    this._dots = new Dots(scene);
    this._dots.initialise(dimensions);
    this._dots.update(this._matrix, 0, 0);
  }

  changeRowDescriptor(rowDescriptor: MessageDescriptor) {
    if (rowDescriptor.mode === "clock") {
      this._scene.time.addEvent({
        delay: 500,
        loop: true,
        callback: this._updateClock,
      });
    }
  }

  _updateClock = () => {
    this._includeFirstColon = !this._includeFirstColon;
    const now = new Date();
    const nowFormatted = formatTime(now, this._includeFirstColon);
    this._matrix.makeMatrixCentre(nowFormatted);
    this._updateDots();
  };

  _updateDots = () => {
    this._dots.update(this._matrix, this._rowOffset, this._colOffset);
  };
}
