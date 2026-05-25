import Phaser from "phaser";

import type { Font } from "@app/fonts";
import { formatTime, type RowDescriptor } from "@app/helpers";

import { Dots, type Dimensions } from "./dots";
import { Matrix } from "./matrix";

const FPS = 60;
const SCROLL_LEFT_DELAY_MS = 1_000 / FPS;
const SCROLL_LEFT_DOTS_PER_SECOND = 50;
const SCROLL_LEFT_DOTS_PER_MS = SCROLL_LEFT_DOTS_PER_SECOND / 1_000;

export class MatrixRow {
  private readonly _scene: Phaser.Scene;
  private _matrix: Matrix;
  private _dots!: Dots;
  private _includeFirstColon = false;
  private _rowOffset = 0;
  private _colOffset = 0;
  private _scrollLeftPrevMs = 0;
  private _useFirstMessage = true;
  private _clockTimer: Phaser.Time.TimerEvent | null = null;
  private _scrollLeftTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, font: Font, dimensions: Dimensions) {
    this._scene = scene;
    // this._font = font;
    // this._dimensions = dimensions;
    this._matrix = new Matrix(font, dimensions.numCols);
    this._matrix.makeMatrixBlank();
    this._dots = new Dots(scene);
    this._dots.initialise(dimensions);
    this._dots.update(this._matrix, 0, 0);
  }

  changeRowDescriptor(rowDescriptor: RowDescriptor) {
    if (rowDescriptor.mode === "off") {
      this._matrix.makeMatrixBlank();
      this._updateDots();
      return;
    }

    if (rowDescriptor.mode === "clock") {
      if (!this._clockTimer) {
        this._updateClock();
        this._clockTimer = this._scene.time.addEvent({
          delay: 500,
          loop: true,
          callback: this._updateClock,
        });
      }
      return;
    }

    if (rowDescriptor.mode === "single") {
      this._matrix.makeMatrixForLayout(
        rowDescriptor.layout,
        this._useFirstMessage,
      );
    }
    if (rowDescriptor.mode === "cycle") {
      this._matrix.makeCycleMatrix(
        rowDescriptor.layouts,
        this._useFirstMessage,
      );
    }

    if (this._matrix.needsScrollLeft()) {
      this._colOffset = 0;
      this._updateDots();
      if (!this._scrollLeftTimer) {
        this._scrollLeftPrevMs = Date.now();
        this._scrollLeftTimer = this._scene.time.addEvent({
          delay: SCROLL_LEFT_DELAY_MS,
          loop: true,
          callback: () => {
            const nowMs = Date.now();
            const deltaMs = nowMs - this._scrollLeftPrevMs;
            this._scrollLeftPrevMs = nowMs;
            const dotsToScroll = Math.round(deltaMs * SCROLL_LEFT_DOTS_PER_MS);
            this._colOffset += dotsToScroll > 1 ? 1 : dotsToScroll;
            this._updateDots();
          },
        });
      }
    } else {
      if (this._scrollLeftTimer) {
        this._scrollLeftTimer.destroy();
        this._scrollLeftTimer = null;
      }
    }
  }

  _updateClock = () => {
    this._includeFirstColon = !this._includeFirstColon;
    const now = new Date();
    const nowFormatted = formatTime(now, this._includeFirstColon);
    this._matrix.makeMatrixCentre(nowFormatted);
    this._updateDots();
  };

  _updateDots = () => {
    this._dots.update(this._matrix, this._rowOffset, this._colOffset);
  };
}
