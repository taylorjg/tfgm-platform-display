import Phaser from "phaser";

import { clockFont, rowFont } from "@app/fonts";
import type { RowDescriptors } from "@app/helpers";

import type { Dimensions } from "./dots";
import { MatrixFrame } from "./matrix-frame";
import { MatrixRow } from "./matrix-row";

export class PlatformDisplayScene extends Phaser.Scene {
  private _dimensions!: Dimensions;
  private _frame!: MatrixFrame;
  private _row1!: MatrixRow;
  private _row2!: MatrixRow;
  private _row3!: MatrixRow;
  private _row4!: MatrixRow;

  constructor() {
    console.log("[PlatformDisplayScene#constructor]");
    super("PlatformDisplayScene");
  }

  create() {
    console.log("[PlatformDisplayScene#create]");

    this._frame = new MatrixFrame(this);
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

    this._row1.transition({ mode: "off" });
    this._row2.transition({ mode: "off" });
    this._row3.transition({ mode: "off" });
    this._row4.transition({ mode: "clock" });

    this.game.events.on(
      "ChangeRowDescriptors",
      this._onChangeRowDescriptors,
      this,
    );

    this.game.events.on(
      "FetchingStateChanged",
      this._onFetchingStateChanged,
      this,
    );

    this.scale.on("resize", this._onResize, this);
  }

  private _onResize = () => {
    console.log("[PlatformDisplayScene#_onResize]");

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

    const isMeaningfulChange = this._dimensions
      ? Math.abs(diameter - this._dimensions.diameter) > 0.01
      : true;

    if (!isMeaningfulChange) return;

    this._frame.rebuild({
      x: marginX,
      y: marginY,
      width: frameWidth,
      height: frameHeight,
      borderWidth,
    });

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

  private _onChangeRowDescriptors = async (rowDescriptors: RowDescriptors) => {
    console.log(
      "[PlatformDisplayScene#_onChangeRowDescriptors]",
      rowDescriptors,
    );

    await Promise.all([
      this._row1.preTransition(),
      this._row2.preTransition(),
      this._row3.preTransition(),
    ]);

    this._row1.transition(rowDescriptors.row1);
    this._row2.transition(rowDescriptors.row2);
    this._row3.transition(rowDescriptors.row3);
  };

  private _onFetchingStateChanged = (isFetching: boolean) => {
    this._frame.setIsFetching(isFetching);
  };
}
