import Phaser from "phaser";

import type { Font } from "@app/fonts";

import { Dots, type Dimensions } from "./dots";
import { Matrix } from "./matrix";

export class MatrixRow {
  private readonly _scene: Phaser.Scene;
  private _font: Font;
  private _dimensions: Dimensions;
  private _matrix: Matrix;
  private _dots!: Dots;

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
}
