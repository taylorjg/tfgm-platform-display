import Phaser from "phaser";

import { fonts, type Font } from "@app/fonts";
import { makeMessageMatrix } from "@app/helpers";
import { first, range } from "@app/utils";

export type LedMatrixSceneData = {
  message: string;
};

type Dimensions = {
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
  private _dimensions!: Dimensions;
  private _font: Font = fonts[1];
  private _messageMatrix!: string[];
  private _dots!: Phaser.GameObjects.Arc[][];

  constructor() {
    super("LedMatrixScene");
    console.log("[LedMatrixScene#constructor]");
  }

  create(data: LedMatrixSceneData) {
    console.log("[LedMatrixScene#create]", data);

    this._messageMatrix = makeMessageMatrix(this._font, data.message);
    this._dots = [];

    this.game.events.on("setMessage", this._onSetMessage, this);

    this._onResize();
  }

  _onSetMessage = (message: string) => {
    console.log("[LedMatrixScene#_onSetMessage]", message);
    this._messageMatrix = makeMessageMatrix(this._font, message);
    const firstLine = first(this._messageMatrix) ?? "";
    const { numCols } = this._dimensions;
    this._dimensions.wrapAtCol = firstLine.length + numCols;
    this._updateDots();
  };

  _onResize = () => {
    console.log("[LedMatrixScene#_onResize]");

    for (const dot of this._dots.flat()) {
      dot.destroy(true);
    }

    const { width, height } = this.scale.displaySize;
    const numVerticalDots = this._font.numVerticalDots;
    const numerator = 10 * height;
    const denominator = 11 * numVerticalDots - 1;
    const diameter = Math.floor(numerator / denominator);
    const radius = diameter / 2;
    const gap = diameter / 10;
    const numRows = numVerticalDots;
    const numCols = Math.floor(width / (diameter + gap));
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

  _getDotColour = (row: number, col: number, offset = 0) => {
    const line = this._messageMatrix[row] ?? "";
    const { wrapAtCol } = this._dimensions;
    const actualCol = (col + offset) % wrapAtCol;
    const ch = line.at(actualCol);
    return ch === "x" ? ON_COLOUR : OFF_COLOUR;
  };

  _initialiseDots = () => {
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

  _updateDots = () => {
    const { numRows, numCols } = this._dimensions;
    const offset = 0;

    const updateRow = (row: number) => {
      for (const col of range(numCols)) {
        const colour = this._getDotColour(row, col, offset);
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
