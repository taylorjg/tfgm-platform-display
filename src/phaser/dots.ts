import Phaser from "phaser";

import { first, range } from "@app/utils";

export type Dimensions = {
  radius: number;
  diameter: number;
  gap: number;
  numRows: number;
  numCols: number;
  marginX: number;
  marginY: number;
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
        this._dots[row][col] = this._scene.add.circle(
          cx,
          cy,
          radius,
          OFF_COLOUR,
        );
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

  update(matrix: string[], rowOffset: number, colOffset: number) {
    const { numRows, numCols } = this._dimensions;
    const totalRows = matrix.length;
    const totalCols = first(matrix).length + numCols;

    for (const row of range(numRows)) {
      const sourceRow = (row + rowOffset) % totalRows;

      for (const col of range(numCols)) {
        const sourceCol = (col + colOffset) % totalCols;

        const fillColour = this._getDotColour(matrix, sourceRow, sourceCol);
        this._dots[row][col].fillColor = fillColour;
      }
    }
  }

  reset() {
    const { numRows, numCols } = this._dimensions;

    for (const row of range(numRows)) {
      for (const col of range(numCols)) {
        this._dots[row][col].fillColor = OFF_COLOUR;
      }
    }
  }

  private _getDotColour(matrix: string[], row: number, col: number) {
    const line = matrix[row] ?? "";
    const ch = line.at(col);
    return ch === "x" ? ON_COLOUR : OFF_COLOUR;
  }

  private _calculateCx = (col: number) => {
    const { radius, diameter, gap, marginX } = this._dimensions;
    return marginX + col * (diameter + gap) + radius;
  };

  private _calculateCy = (row: number) => {
    const { radius, diameter, gap, marginY } = this._dimensions;
    return marginY + row * (diameter + gap) + radius;
  };
}
