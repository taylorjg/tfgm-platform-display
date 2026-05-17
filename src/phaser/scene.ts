import Phaser from "phaser";

import { type Font } from "@app/fonts";
import {
  formatTime,
  type MessageDescriptor,
  makeMatrixBlank,
  makeMatrixForMessageDescriptor,
  makeMatrixCentre,
} from "@app/helpers";
import { first, range } from "@app/utils";

import { ScrollLeft, ScrollUp, type MatrixEffect } from "./matrix-effects";

export type LedMatrixSceneData = {
  font: Font;
  numCols: number;
  messageDescriptor: MessageDescriptor;
};

export type Dimensions = {
  radius: number;
  diameter: number;
  gap: number;
  numRows: number;
  numCols: number;
  wrapAtCol: number;
  marginX: number;
  marginY: number;
};

const ON_COLOUR = 0xffff00;
const OFF_COLOUR = 0x303030;

export class LedMatrixScene extends Phaser.Scene {
  private _font!: Font;
  private _messageDescriptor!: MessageDescriptor;
  private _messageMatrix!: string[];
  private _dimensions!: Dimensions;
  private _dots: Phaser.GameObjects.Arc[][] = [];
  private _scrollLeft!: MatrixEffect;
  private _scrollUp!: MatrixEffect;
  private _currentEffect: MatrixEffect | null = null;
  private _includeFirstColon = false;

  constructor() {
    console.log("[LedMatrixScene#constructor]");
    super("LedMatrixScene");
  }

  create(data: LedMatrixSceneData) {
    console.log("[LedMatrixScene#create]", data);

    this._font = data.font;
    this._messageDescriptor = data.messageDescriptor;
    this._messageMatrix = makeMatrixBlank(this._font, data.numCols);

    this._onResize(data.numCols);

    this.game.events.on(
      "SetMessageDescriptor",
      this._onSetMessageDescriptor,
      this,
    );

    this._scrollLeft = new ScrollLeft(this._dimensions);
    this._scrollUp = new ScrollUp(this._dimensions);

    if (this._messageDescriptor.mode === "clock") {
      this.time.addEvent({
        delay: 500,
        loop: true,
        callback: this._updateClock,
        callbackScope: this,
      });
    } else {
      this._onSetMessageDescriptor(this._messageDescriptor);
    }
  }

  update(_: number, deltaMs: number) {
    if (this._currentEffect) {
      this._currentEffect.tick(deltaMs);
      this._updateDots();
    }
  }

  _updateClock = () => {
    this._includeFirstColon = !this._includeFirstColon;
    const now = new Date();
    const nowFormatted = formatTime(now, this._includeFirstColon);
    this._messageMatrix = makeMatrixCentre(
      this._font,
      this._dimensions.numCols,
      nowFormatted,
    );
    this._updateDots();
  };

  _onSetMessageDescriptor = (messageDescriptor: MessageDescriptor) => {
    console.log("[LedMatrixScene#_onSetMessageDescriptor]", messageDescriptor);

    if (this._messageDescriptor.mode === "clock") return;

    this._messageMatrix = makeMatrixForMessageDescriptor(
      this._font,
      this._dimensions.numCols,
      messageDescriptor,
    );

    const firstLine = first(this._messageMatrix) ?? "";
    const contentCols = firstLine.length;
    const { numCols } = this._dimensions;

    this._currentEffect = contentCols > numCols ? this._scrollLeft : null;
    this._dimensions.wrapAtCol = firstLine.length + numCols;

    this._updateDots();
  };

  _onResize = (numCols: number) => {
    console.log("[LedMatrixScene#_onResize]");

    this._destroyDots();

    const { width, height } = this.scale.displaySize;
    const numRows = this._font.numVerticalDots;

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
    const firstLine = first(this._messageMatrix) ?? "";
    const wrapAtCol = firstLine.length + numCols;

    this._dimensions = {
      radius,
      diameter,
      gap,
      numRows,
      numCols,
      wrapAtCol,
      marginX,
      marginY,
    };

    this._initialiseDots();
    this._updateDots();
  };

  _getDotColour = (row: number, col: number) => {
    const nextRowCol = this._currentEffect
      ? this._currentEffect.nextRowCol(row, col)
      : { row, col };
    const { row: actualRow, col: actualCol } = nextRowCol;
    const line = this._messageMatrix[actualRow] ?? "";
    const ch = line.at(actualCol);
    return ch === "x" ? ON_COLOUR : OFF_COLOUR;
  };

  _initialiseDots = () => {
    console.log("[LedMatrixScene#_initialiseDots]");

    const { numRows, numCols, radius } = this._dimensions;

    this._dots = [];

    for (const row of range(numRows)) {
      this._dots[row] = [];
      const cy = this._calculateCy(row);
      for (const col of range(numCols)) {
        const cx = this._calculateCx(col);
        this._dots[row][col] = this.add.circle(cx, cy, radius, OFF_COLOUR);
      }
    }
  };

  _destroyDots = () => {
    console.log("[LedMatrixScene#_destroyDots]");

    for (const dot of this._dots.flat()) {
      dot.destroy(true);
    }

    this._dots = [];
  };

  _updateDots = () => {
    const { numRows, numCols } = this._dimensions;

    const updateRow = (row: number) => {
      for (const col of range(numCols)) {
        const colour = this._getDotColour(row, col);
        this._dots[row][col].fillColor = colour;
      }
    };

    for (const row of range(numRows)) {
      updateRow(row);
    }
  };

  _calculateCx = (col: number) => {
    const { radius, diameter, gap, marginX } = this._dimensions;
    return marginX + col * (diameter + gap) + radius;
  };

  _calculateCy = (row: number) => {
    const { radius, diameter, gap, marginY } = this._dimensions;
    return marginY + row * (diameter + gap) + radius;
  };
}
