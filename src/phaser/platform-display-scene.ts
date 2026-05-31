import Phaser from "phaser";

import { clockFont, rowFont } from "@app/fonts";
import type { RowDescriptors } from "@app/helpers";

import type { Dimensions } from "./dots";
import { Frame } from "./frame";
import { MatrixRow } from "./matrix-row";

// These sizes are all measured in "dots" e.g. frame border is 6 dots wide, gaps are 2 dots wide, etc.
const MAIN_ROW_ROWS = 9;
const MAIN_ROW_COLS = 185;
const CLOCK_ROW_ROWS = 9;
const CLOCK_ROW_COLS = 63;
const FRAME_SIZE = 6;
const GAP_SIZE = 2;
const TOTAL_ROWS =
  MAIN_ROW_ROWS * 3 + CLOCK_ROW_ROWS + GAP_SIZE * 5 + FRAME_SIZE * 2;
const TOTAL_COLS = MAIN_ROW_COLS + GAP_SIZE * 2 + FRAME_SIZE * 2;

export class PlatformDisplayScene extends Phaser.Scene {
  private _dimensions!: Dimensions;
  private _frame!: Frame;
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

    this._frame = new Frame(this);

    this._onResize();

    this._row1 = new MatrixRow(
      this,
      rowFont,
      {
        ...this._dimensions,
        offsetX: this._calculateOffsetX(0),
        offsetY: this._calculateOffsetY(0),
      },
      MAIN_ROW_ROWS,
      MAIN_ROW_COLS,
    );

    this._row2 = new MatrixRow(
      this,
      rowFont,
      {
        ...this._dimensions,
        offsetX: this._calculateOffsetX(0),
        offsetY: this._calculateOffsetY(MAIN_ROW_ROWS + GAP_SIZE),
      },
      MAIN_ROW_ROWS,
      MAIN_ROW_COLS,
    );

    this._row3 = new MatrixRow(
      this,
      rowFont,
      {
        ...this._dimensions,
        offsetX: this._calculateOffsetX(0),
        offsetY: this._calculateOffsetY((MAIN_ROW_ROWS + GAP_SIZE) * 2),
      },
      MAIN_ROW_ROWS,
      MAIN_ROW_COLS,
    );

    this._row4 = new MatrixRow(
      this,
      clockFont,
      {
        ...this._dimensions,
        offsetX: this._calculateOffsetX((MAIN_ROW_COLS - CLOCK_ROW_COLS) / 2),
        offsetY: this._calculateOffsetY((MAIN_ROW_ROWS + GAP_SIZE) * 3),
      },
      CLOCK_ROW_ROWS,
      CLOCK_ROW_COLS,
    );

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

    const numRows = TOTAL_ROWS;
    const numCols = TOTAL_COLS;

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
      diameter,
      radius,
      gap,
      offsetX: marginX,
      offsetY: marginY,
    };

    this._dimensions = newDimensions;

    this._row1?.changeDimensions({
      ...this._dimensions,
      offsetX: this._calculateOffsetX(0),
      offsetY: this._calculateOffsetY(0),
    });

    this._row2?.changeDimensions({
      ...this._dimensions,
      offsetX: this._calculateOffsetX(0),
      offsetY: this._calculateOffsetY(MAIN_ROW_ROWS + GAP_SIZE),
    });

    this._row3?.changeDimensions({
      ...this._dimensions,
      offsetX: this._calculateOffsetX(0),
      offsetY: this._calculateOffsetY((MAIN_ROW_ROWS + GAP_SIZE) * 2),
    });

    this._row4?.changeDimensions({
      ...this._dimensions,
      offsetX: this._calculateOffsetX((MAIN_ROW_COLS - CLOCK_ROW_COLS) / 2),
      offsetY: this._calculateOffsetY((MAIN_ROW_ROWS + GAP_SIZE) * 3),
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

  private _calculateOffsetX = (deltaCols: number) => {
    const { diameter, gap, offsetX } = this._dimensions;
    return (
      offsetX + (FRAME_SIZE + GAP_SIZE + deltaCols) * (diameter + gap) - gap
    );
  };

  private _calculateOffsetY = (deltaRows: number) => {
    const { diameter, gap, offsetY } = this._dimensions;
    return (
      offsetY + (FRAME_SIZE + GAP_SIZE + deltaRows) * (diameter + gap) - gap
    );
  };
}
