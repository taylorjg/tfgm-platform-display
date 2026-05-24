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

export class Dots {
  private _dots: Phaser.GameObjects.Arc[][] = [];
  private _dimensions!: Dimensions;
  private readonly _scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  initialise(dimensions: Dimensions) {
    console.log("[Dots#initialise]");

    this._dimensions = dimensions;
    this._dots = [];

    const { numRows, numCols, radius } = dimensions;

    for (const row of range(numRows)) {
      this._dots[row] = [];
      const cy = this._calculateCy(row);
      for (const col of range(numCols)) {
        const cx = this._calculateCx(col);
        const dot = this._scene.add.circle(cx, cy, radius, OFF_COLOUR);
        this._dots[row][col] = dot;
      }
    }
  }

  destroy() {
    console.log("[Dots#destroy]");

    for (const dot of this._dots.flat()) {
      dot.destroy(true);
    }

    this._dots = [];
  }

  update(matrix: Matrix, rowOffset: number, colOffset: number) {
    const { numRows, numCols } = this._dimensions;
    const { totalRows, totalCols } = matrix.size();

    for (const row of range(numRows)) {
      const sourceRow = (row + rowOffset) % totalRows;

      for (const col of range(numCols)) {
        const sourceCol = (col + colOffset) % totalCols;
        const isDotOn = matrix.isDotOn(sourceRow, sourceCol);
        const fillColour = isDotOn ? ON_COLOUR : OFF_COLOUR;
        this._dots[row][col].fillColor = fillColour;
      }
    }
  }

  private _calculateCx = (col: number) => {
    const { radius, diameter, gap, offsetX } = this._dimensions;
    return offsetX + col * (diameter + gap) + radius;
  };

  private _calculateCy = (row: number) => {
    const { radius, diameter, gap, offsetY } = this._dimensions;
    return offsetY + row * (diameter + gap) + radius;
  };
}
