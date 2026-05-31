import Phaser from "phaser";

import { range } from "@app/utils";

import { BG_COLOUR, OFF_COLOUR, ON_COLOUR } from "./constants";
import type { MatrixState } from "./matrix-state";

export type Dimensions = {
  radius: number;
  diameter: number;
  gap: number;
  offsetX: number;
  offsetY: number;
};

export class Dots {
  private readonly _scene: Phaser.Scene;
  private _dimensions!: Dimensions;
  private _numRows!: number;
  private _numCols!: number;
  private _renderTexture?: Phaser.GameObjects.RenderTexture;
  private _graphics?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  initialise(dimensions: Dimensions, numRows: number, numCols: number) {
    this.destroy();

    this._dimensions = dimensions;
    this._numRows = numRows;
    this._numCols = numCols;

    const { offsetX, offsetY } = dimensions;
    const width = this._gridWidth();
    const height = this._gridHeight();

    this._renderTexture = this._scene.add
      .renderTexture(offsetX, offsetY, width, height)
      .setOrigin(0, 0);

    this._graphics = this._scene.make.graphics();
  }

  destroy() {
    this._renderTexture?.destroy(true);
    this._renderTexture = undefined;

    this._graphics?.destroy(true);
    this._graphics = undefined;
  }

  update(
    matrixState: MatrixState,
    rowOffset: number,
    colOffset: number,
    fillColour?: number,
  ) {
    if (!this._renderTexture || !this._graphics) return;

    this._redraw(matrixState, rowOffset, colOffset, fillColour);
  }

  private _redraw(
    matrixState: MatrixState,
    rowOffset: number,
    colOffset: number,
    fillColour?: number,
  ) {
    if (!this._renderTexture || !this._graphics) return;

    this._graphics.clear();

    for (const row of range(this._numRows)) {
      for (const col of range(this._numCols)) {
        this._drawDot(matrixState, row, col, rowOffset, colOffset, fillColour);
      }
    }

    this._renderTexture.clear();
    this._renderTexture.fill(BG_COLOUR);
    this._renderTexture.draw(this._graphics);
    this._renderTexture.render();
  }

  private _drawDot(
    matrixState: MatrixState,
    row: number,
    col: number,
    rowOffset: number,
    colOffset: number,
    fillColour?: number,
  ) {
    if (!this._graphics) return;

    const { totalRows, totalCols } = matrixState.size();
    const sourceRow = (row + rowOffset) % totalRows;
    const sourceCol = (col + colOffset) % totalCols;

    const isDotOn = matrixState.isDotOn(sourceRow, sourceCol);
    const colour = isDotOn ? (fillColour ?? ON_COLOUR) : OFF_COLOUR;

    const x = this._calculateX(col);
    const y = this._calculateY(row);
    const radius = this._dimensions.radius;

    this._graphics.fillStyle(colour);
    this._graphics.fillCircle(x, y, radius);
  }

  private _gridWidth = () => {
    return this._calculateX(this._numCols);
  };

  private _gridHeight = () => {
    return this._calculateX(this._numRows);
  };

  private _calculateX = (col: number) => {
    const { diameter, gap, radius } = this._dimensions;
    return col * (diameter + gap) + radius;
  };

  private _calculateY = (row: number) => {
    const { diameter, gap, radius } = this._dimensions;
    return row * (diameter + gap) + radius;
  };
}
