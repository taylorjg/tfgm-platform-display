import Phaser from "phaser";

import { range } from "@app/utils";

import type { MatrixState } from "./matrix-state";

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

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  initialise(dimensions: Dimensions) {
    this.destroy();

    this._dimensions = dimensions;

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

  update(matrixState: MatrixState, rowOffset: number, colOffset: number) {
    if (!this._renderTexture || !this._graphics) return;

    this._redraw(matrixState, rowOffset, colOffset);
  }

  private _redraw(
    matrixState: MatrixState,
    rowOffset: number,
    colOffset: number,
  ) {
    if (!this._renderTexture || !this._graphics) return;

    this._graphics.clear();

    const { numRows, numCols } = this._dimensions;

    for (const row of range(numRows)) {
      for (const col of range(numCols)) {
        this._drawDot(matrixState, row, col, rowOffset, colOffset);
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
  ) {
    if (!this._graphics) return;

    const { totalRows, totalCols } = matrixState.size();
    const sourceRow = (row + rowOffset) % totalRows;
    const sourceCol = (col + colOffset) % totalCols;

    const isDotOn = matrixState.isDotOn(sourceRow, sourceCol);
    const colour = isDotOn ? ON_COLOUR : OFF_COLOUR;

    const x = this._calculateX(col);
    const y = this._calculateY(row);
    const radius = this._dimensions.radius;

    this._graphics.fillStyle(colour);
    this._graphics.fillCircle(x, y, radius);
  }

  private _gridWidth = () => {
    return this._calculateX(this._dimensions.numCols);
  };

  private _gridHeight = () => {
    return this._calculateX(this._dimensions.numRows);
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
