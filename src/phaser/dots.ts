import Phaser from "phaser";

import { range } from "@app/utils";
import type { Matrix } from "./matrix";

export type Dimensions = {
  radius: number;
  diameter: number;
  gap: number;
  numRows: number;
  numCols: number;
  offsetX: number;
  offsetY: number;
};

const ON_COLOUR = 0xffff00;
const OFF_COLOUR = 0x303030;
const BG_COLOUR = 0x000000;

export class Dots {
  private _renderTexture?: Phaser.GameObjects.RenderTexture;
  private _graphics?: Phaser.GameObjects.Graphics;
  private _dimensions!: Dimensions;
  private readonly _scene: Phaser.Scene;
  private _lastColOffset: number | null = null;
  private _lastRowOffset: number | null = null;

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  initialise(dimensions: Dimensions) {
    this.destroy();

    this._dimensions = dimensions;
    this._lastColOffset = null;
    this._lastRowOffset = null;

    const { offsetX, offsetY } = dimensions;
    const width = this._gridWidth();
    const height = this._gridHeight();

    this._renderTexture = this._scene.add
      .renderTexture(offsetX, offsetY, width, height)
      .setOrigin(0, 0);

    this._graphics = this._scene.make.graphics({}, false);
  }

  destroy() {
    this._renderTexture?.destroy(true);
    this._graphics?.destroy(true);

    this._renderTexture = undefined;
    this._graphics = undefined;
    this._lastColOffset = null;
    this._lastRowOffset = null;
  }

  update(matrix: Matrix, rowOffset: number, colOffset: number) {
    if (!this._renderTexture || !this._graphics) return;

    if (
      this._lastColOffset === colOffset &&
      this._lastRowOffset === rowOffset
    ) {
      return;
    }

    this._redraw(matrix, rowOffset, colOffset);
    this._lastColOffset = colOffset;
    this._lastRowOffset = rowOffset;
  }

  resetOffsetTracking() {
    this._lastColOffset = null;
    this._lastRowOffset = null;
  }

  private _redraw(matrix: Matrix, rowOffset: number, colOffset: number) {
    this._graphics!.clear();

    const { numRows, numCols } = this._dimensions;
    for (const row of range(numRows)) {
      for (const col of range(numCols)) {
        this._drawDot(matrix, rowOffset, colOffset, row, col);
      }
    }

    this._renderTexture!.clear();
    this._renderTexture!.fill(BG_COLOUR);
    this._renderTexture!.draw(this._graphics!, 0, 0);
    this._renderTexture!.render();
  }

  private _drawDot(
    matrix: Matrix,
    rowOffset: number,
    colOffset: number,
    screenRow: number,
    screenCol: number,
  ) {
    const { totalRows, totalCols } = matrix.size();
    const sourceRow = (screenRow + rowOffset) % totalRows;
    const sourceCol = (screenCol + colOffset) % totalCols;
    const colour = matrix.isDotOn(sourceRow, sourceCol)
      ? ON_COLOUR
      : OFF_COLOUR;

    const { radius, diameter, gap } = this._dimensions;
    const x = screenCol * (diameter + gap) + radius;
    const y = screenRow * (diameter + gap) + radius;

    this._graphics!.fillStyle(colour, 1);
    this._graphics!.fillCircle(x, y, radius);
  }

  private _gridWidth = () => {
    const { numCols, diameter, gap } = this._dimensions;
    return numCols * (diameter + gap) - gap;
  };

  private _gridHeight = () => {
    const { numRows, diameter, gap } = this._dimensions;
    return numRows * (diameter + gap) - gap;
  };
}
