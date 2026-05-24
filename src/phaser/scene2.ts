import Phaser from "phaser";

import { clockFont, rowFont } from "@app/fonts";

import type { Dimensions } from "./dots";
import { MatrixRow } from "./matrix-row";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type LedMatrixScene2Data = {
  // TODO
};

export class LedMatrixScene2 extends Phaser.Scene {
  private _dimensions!: Dimensions;
  private _row1!: MatrixRow;
  private _row2!: MatrixRow;
  private _row3!: MatrixRow;
  private _row4!: MatrixRow;

  constructor() {
    console.log("[LedMatrixScene2#constructor]");
    super("LedMatrixScene2");
  }

  create(data: LedMatrixScene2Data) {
    console.log("[LedMatrixScene2#create]", data);
    // this.scale.on("resize", this._onResize, this);
    this._onResize();

    const { diameter, gap, offsetX, offsetY } = this._dimensions;

    this._row1 = new MatrixRow(this, rowFont, {
      ...this._dimensions,
      numRows: 9,
      numCols: 185,
      offsetX: offsetX + 8 * (diameter + gap) - gap,
      offsetY: offsetY + 8 * (diameter + gap) - gap,
    });

    this._row2 = new MatrixRow(this, rowFont, {
      ...this._dimensions,
      numRows: 9,
      numCols: 185,
      offsetX: offsetX + 8 * (diameter + gap) - gap,
      offsetY: offsetY + 19 * (diameter + gap) - gap,
    });

    this._row3 = new MatrixRow(this, rowFont, {
      ...this._dimensions,
      numRows: 9,
      numCols: 185,
      offsetX: offsetX + 8 * (diameter + gap) - gap,
      offsetY: offsetY + 30 * (diameter + gap) - gap,
    });

    this._row4 = new MatrixRow(this, clockFont, {
      ...this._dimensions,
      numRows: 9,
      numCols: 63,
      offsetX: offsetX + (8 + (185 - 63) / 2) * (diameter + gap) - gap,
      offsetY: offsetY + 41 * (diameter + gap) - gap,
    });
  }

  _onResize = () => {
    console.log("[LedMatrixScene2#_onResize]");

    const numRows = 58; // rows + gaps + frame = 4x9 + 5x2 + 6x2
    const numCols = 201; // cols + gaps + frame = 185 + 2x2 + 6x2

    const { width, height } = this.scale.displaySize;

    const numeratorH = 10 * height;
    const denominatorH = 11 * numRows - 1;
    const diameterH = Math.floor(numeratorH / denominatorH);

    const numeratorW = 10 * width;
    const denominatorW = 11 * numCols - 1;
    const diameterW = Math.floor(numeratorW / denominatorW);

    const diameter = Math.min(diameterH, diameterW);
    const radius = diameter / 2;
    const gap = diameter / 10;

    const marginX = (width - (numCols * (diameter + gap) - gap)) / 2;
    const marginY = (height - (numRows * (diameter + gap) - gap)) / 2;

    const frameWidth = numCols * (diameter + gap) - gap;
    const frameHeight = numRows * (diameter + gap) - gap;
    const borderWidth = 6 * (diameter + gap) - gap;
    const borderColor = 0x808080;

    this.add
      .rectangle(marginX, marginY, frameWidth, frameHeight, borderColor)
      .setOrigin(0, 0);

    this.add
      .rectangle(
        marginX + borderWidth,
        marginY + borderWidth,
        frameWidth - 2 * borderWidth,
        frameHeight - 2 * borderWidth,
        0x000000,
      )
      .setOrigin(0, 0);

    this._dimensions = {
      numRows,
      numCols,
      diameter,
      radius,
      gap,
      offsetY: marginY,
      offsetX: marginX,
    };
  };
}
