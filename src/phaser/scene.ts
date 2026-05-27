import Phaser from "phaser";

import { clockFont, rowFont } from "@app/fonts";

import type { Dimensions } from "./dots";
import { MatrixRow } from "./matrix-row";
import type { RowDescriptors } from "@app/helpers";

export class LedMatrixScene extends Phaser.Scene {
  private _dimensions!: Dimensions;
  private _row1!: MatrixRow;
  private _row2!: MatrixRow;
  private _row3!: MatrixRow;
  private _row4!: MatrixRow;
  private _frameOuter?: Phaser.GameObjects.Rectangle;
  private _frameInner?: Phaser.GameObjects.Rectangle;

  constructor() {
    console.log("[LedMatrixScene#constructor]");
    super("LedMatrixScene");
  }

  create() {
    console.log("[LedMatrixScene#create]");

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

    this._row1.changeRowDescriptor({ mode: "off" });
    this._row2.changeRowDescriptor({ mode: "off" });
    this._row3.changeRowDescriptor({ mode: "off" });
    this._row4.changeRowDescriptor({ mode: "clock" });

    this.game.events.on(
      "ChangeRowDescriptors",
      this._onChangeRowDescriptors,
      this,
    );

    this.scale.on("resize", this._onResize, this);
  }

  update = (_: unknown, deltaMs: number) => {
    this._row1.update(deltaMs);
    this._row2.update(deltaMs);
    this._row3.update(deltaMs);
    this._row4.update(deltaMs);
  };

  _onResize = () => {
    console.log("[LedMatrixScene#_onResize]");

    const numRows = 58; // rows + gaps + frame = 4x9 + 5x2 + 6x2
    const numCols = 201; // cols + gaps + frame = 185 + 2x2 + 6x2

    const { width, height } = this.scale.displaySize;

    const numeratorH = 10 * height;
    const denominatorH = 11 * numRows - 1;
    const diameterH = numeratorH / denominatorH;

    const numeratorW = 10 * width;
    const denominatorW = 11 * numCols - 1;
    const diameterW = numeratorW / denominatorW;

    const diameter = Math.min(diameterH, diameterW);
    const radius = diameter / 2;
    const gap = diameter / 10;

    const marginX = (width - (numCols * (diameter + gap) - gap)) / 2;
    const marginY = (height - (numRows * (diameter + gap) - gap)) / 2;

    const frameWidth = numCols * (diameter + gap) - gap;
    const frameHeight = numRows * (diameter + gap) - gap;
    const borderWidth = 6 * (diameter + gap) - gap;
    const borderColor = 0x808080;

    const isMeaningfulChange = this._dimensions
      ? Math.abs(diameter - this._dimensions.diameter) > 0.1
      : true;

    if (!isMeaningfulChange) return;

    if (this._frameOuter) {
      this._frameOuter.destroy();
    }

    if (this._frameInner) {
      this._frameInner.destroy();
    }

    this._frameOuter = this.add
      .rectangle(marginX, marginY, frameWidth, frameHeight, borderColor)
      .setOrigin(0, 0);

    this._frameInner = this.add
      .rectangle(
        marginX + borderWidth,
        marginY + borderWidth,
        frameWidth - 2 * borderWidth,
        frameHeight - 2 * borderWidth,
        0x000000,
      )
      .setOrigin(0, 0);

    const newDimensions = {
      numRows,
      numCols,
      diameter,
      radius,
      gap,
      offsetY: marginY,
      offsetX: marginX,
    };

    this._dimensions = newDimensions;

    this._row1?.changeDimensions({
      ...this._dimensions,
      numRows: 9,
      numCols: 185,
      offsetX: marginX + 8 * (diameter + gap) - gap,
      offsetY: marginY + 8 * (diameter + gap) - gap,
    });

    this._row2?.changeDimensions({
      ...this._dimensions,
      numRows: 9,
      numCols: 185,
      offsetX: marginX + 8 * (diameter + gap) - gap,
      offsetY: marginY + 19 * (diameter + gap) - gap,
    });

    this._row3?.changeDimensions({
      ...this._dimensions,
      numRows: 9,
      numCols: 185,
      offsetX: marginX + 8 * (diameter + gap) - gap,
      offsetY: marginY + 30 * (diameter + gap) - gap,
    });

    this._row4?.changeDimensions({
      ...this._dimensions,
      numRows: 9,
      numCols: 63,
      offsetX: marginX + (8 + (185 - 63) / 2) * (diameter + gap) - gap,
      offsetY: marginY + 41 * (diameter + gap) - gap,
    });
  };

  _onChangeRowDescriptors = (rowDescriptors: RowDescriptors) => {
    console.log("[LedMatrixScene#_onChangeRowDescriptors]", rowDescriptors);

    this._row1.changeRowDescriptor(rowDescriptors.row1);
    this._row2.changeRowDescriptor(rowDescriptors.row2);
    this._row3.changeRowDescriptor(rowDescriptors.row3);
  };
}
