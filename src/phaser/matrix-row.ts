import Phaser from "phaser";

import type { Font } from "@app/fonts";
import { formatTime, type RowDescriptor } from "@app/helpers";

import { Dots, type Dimensions } from "./dots";
import { Matrix } from "./matrix";

// const FPS = 60;
// const SCROLL_LEFT_DELAY_MS = 1_000 / FPS;
const SCROLL_LEFT_DOTS_PER_SECOND = 50;
const SCROLL_LEFT_DOTS_PER_MS = SCROLL_LEFT_DOTS_PER_SECOND / 1_000;
const ALTERNATING_DELAY_MS = 2_000;
const CYCLE_DELAY_MS = 4_000;

const isAlternatingRow = (rowDescriptor: RowDescriptor) =>
  (rowDescriptor.mode === "single" &&
    rowDescriptor.layout.type === "alternating") ||
  (rowDescriptor.mode === "cycle" &&
    rowDescriptor.layouts.some((layout) => layout.type === "alternating"));

export class MatrixRow {
  private readonly _scene: Phaser.Scene;
  private _dimensions: Dimensions;
  private _matrix: Matrix;
  private _dots!: Dots;
  private _includeFirstColon = false;
  private _rowOffset = 0;
  private _colOffset = 0;
  // private _scrollLeftPrevMs = 0;
  private _scrollLeftEnabled = false;
  private _useFirstMessage = true;
  private _clockTimer: Phaser.Time.TimerEvent | null = null;
  private _alternatingTimer: Phaser.Time.TimerEvent | null = null;
  private _cycleTimer: Phaser.Time.TimerEvent | null = null;
  // private _scrollLeftTimer: Phaser.Time.TimerEvent | null = null;
  private _scrollUpTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: Phaser.Scene, font: Font, dimensions: Dimensions) {
    this._scene = scene;
    this._dimensions = dimensions;
    this._matrix = new Matrix(font, dimensions.numCols);
    this._matrix.makeMatrixBlank();
    this._dots = new Dots(scene);
    this._dots.initialise(dimensions);
    this._dots.update(this._matrix, 0, 0);
  }

  changeDimensions(dimensions: Dimensions) {
    this._dimensions = dimensions;
    this._dots.destroy();
    this._dots.initialise(dimensions);
    this._updateDots();
  }

  changeRowDescriptor(rowDescriptor: RowDescriptor) {
    this._reset();

    switch (rowDescriptor.mode) {
      case "off":
        this._handleOffRow();
        break;

      case "clock":
        this._handleClockRow();
        break;

      case "single":
        this._handleSingleRow(rowDescriptor);
        break;

      case "cycle":
        this._handleCycleRow(rowDescriptor);
        break;
    }

    this._updateDots();
  }

  _reset = () => {
    this._rowOffset = 0;
    this._colOffset = 0;
    this._useFirstMessage = true;

    if (this._alternatingTimer) {
      this._alternatingTimer.destroy();
      this._alternatingTimer = null;
    }

    if (this._cycleTimer) {
      this._cycleTimer.destroy();
      this._cycleTimer = null;
    }

    // if (this._scrollLeftTimer) {
    //   this._scrollLeftTimer.destroy();
    //   this._scrollLeftTimer = null;
    // }
    this._scrollLeftEnabled = false;

    if (this._scrollUpTimer) {
      this._scrollUpTimer.destroy();
      this._scrollUpTimer = null;
    }
  };

  update = (deltaMs: number) => {
    console.log({ deltaMs });

    if (!this._scrollLeftEnabled) return;

    const dotsToScroll = Math.round(deltaMs * SCROLL_LEFT_DOTS_PER_MS);
    this._colOffset += dotsToScroll;
    this._updateDots();
  };

  _handleOffRow = () => {
    this._matrix.makeMatrixBlank();
  };

  _handleClockRow = () => {
    if (!this._clockTimer) {
      this._clockTimer = this._scene.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
          this._updateClock();
          this._updateDots();
        },
      });

      this._updateClock();
    }
  };

  _handleSingleRow = (rowDescriptor: RowDescriptor) => {
    if (rowDescriptor.mode !== "single") return;

    this._matrix.makeMatrixForLayout(
      rowDescriptor.layout,
      this._useFirstMessage,
    );

    if (this._matrix.needsScrollLeft()) {
      this._addScrollLeftTimer();
    }

    if (isAlternatingRow(rowDescriptor)) {
      this._addAlternatingTimer(rowDescriptor);
    }
  };

  _handleCycleRow = (rowDescriptor: RowDescriptor) => {
    if (rowDescriptor.mode !== "cycle") return;

    this._matrix.makeCycleMatrix(rowDescriptor.layouts, this._useFirstMessage);

    this._addCycleTimer();

    if (isAlternatingRow(rowDescriptor)) {
      this._addAlternatingTimer(rowDescriptor);
    }
  };

  // _addScrollLeftTimer = () => {
  //   this._scrollLeftPrevMs = Date.now();
  //   this._scrollLeftTimer = this._scene.time.addEvent({
  //     delay: SCROLL_LEFT_DELAY_MS,
  //     loop: true,
  //     callback: () => {
  //       const nowMs = Date.now();
  //       const deltaMs = nowMs - this._scrollLeftPrevMs;
  //       this._scrollLeftPrevMs = nowMs;
  //       const dotsToScroll = Math.round(deltaMs * SCROLL_LEFT_DOTS_PER_MS);
  //       this._colOffset += dotsToScroll;
  //       this._updateDots();
  //     },
  //   });
  // };
  _addScrollLeftTimer = () => {
    this._scrollLeftEnabled = true;
  };

  _addScrollUpTimer = () => {
    if (this._scrollUpTimer) {
      this._scrollUpTimer.destroy();
      this._scrollUpTimer = null;
    }

    this._scrollUpTimer = this._scene.time.addEvent({
      delay: 50,
      repeat: this._dimensions.numRows - 1,
      callback: () => {
        this._rowOffset++;
        this._updateDots();
      },
    });
  };

  _addCycleTimer = () => {
    this._cycleTimer = this._scene.time.addEvent({
      delay: CYCLE_DELAY_MS,
      loop: true,
      callback: () => {
        this._addScrollUpTimer();
      },
    });
  };

  _addAlternatingTimer = (rowDescriptor: RowDescriptor) => {
    const isSingle = rowDescriptor.mode === "single";
    const isCycle = rowDescriptor.mode === "cycle";

    this._alternatingTimer = this._scene.time.addEvent({
      delay: ALTERNATING_DELAY_MS,
      loop: true,
      callback: () => {
        this._useFirstMessage = !this._useFirstMessage;

        if (isSingle) {
          this._matrix.makeMatrixForLayout(
            rowDescriptor.layout,
            this._useFirstMessage,
          );
        }

        if (isCycle) {
          this._matrix.makeCycleMatrix(
            rowDescriptor.layouts,
            this._useFirstMessage,
          );
        }

        this._updateDots();
      },
    });
  };

  _updateClock = () => {
    this._includeFirstColon = !this._includeFirstColon;
    const now = new Date();
    const nowFormatted = formatTime(now, this._includeFirstColon);
    this._matrix.makeMatrixCentre(nowFormatted);
  };

  _updateDots = () => {
    this._dots.update(this._matrix, this._rowOffset, this._colOffset);
  };
}
