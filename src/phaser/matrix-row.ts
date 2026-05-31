import Phaser from "phaser";

import type { Font } from "@app/fonts";
import { formatTime, tweenComplete, type RowDescriptor } from "@app/helpers";

import { offColourObject, onColourObject } from "./constants";
import { Dots, type Dimensions } from "./dots";
import { MatrixState } from "./matrix-state";

const SCROLL_H_DOTS_PER_SECOND = 40;
const SCROLL_H_CYCLE_MS = 1_000;
const SCROLL_H_COLS_PER_CYCLE = SCROLL_H_DOTS_PER_SECOND;

const SCROLL_V_DOTS_PER_SECOND = 20;

const ALTERNATING_DELAY_SECONDS = 2;
const ALTERNATING_DELAY_MS = ALTERNATING_DELAY_SECONDS * 1_000;

const CYCLE_DELAY_SECONDS = 4;
const CYCLE_DELAY_MS = CYCLE_DELAY_SECONDS * 1_000;

const CLOCK_DELAY_MS = 500;

const FADE_OUT_DURATION_MS = 1_000;

const isAlternatingRow = (rowDescriptor: RowDescriptor) =>
  (rowDescriptor.mode === "single" &&
    rowDescriptor.layout.type === "alternating") ||
  (rowDescriptor.mode === "cycle" &&
    rowDescriptor.layouts.some((layout) => layout.type === "alternating"));

export class MatrixRow {
  private readonly _scene: Phaser.Scene;
  private _dimensions: Dimensions;
  private _matrixState: MatrixState;
  private _dots!: Dots;
  private _includeFirstColon = false;
  private _useFirstMessage = true;
  private readonly _scrollTweenState = { rowOffset: 0, colOffset: 0 };
  private _clockTimer: Phaser.Time.TimerEvent | null = null;
  private _alternatingTimer: Phaser.Time.TimerEvent | null = null;
  private _cycleTimer: Phaser.Time.TimerEvent | null = null;
  private _scrollLeftTween: Phaser.Tweens.Tween | null = null;
  private _scrollUpTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, font: Font, dimensions: Dimensions) {
    this._scene = scene;
    this._dimensions = dimensions;
    this._matrixState = new MatrixState(font, dimensions.numCols);
    this._dots = new Dots(scene);
    this._dots.initialise(dimensions);
    this._updateDots();
  }

  changeDimensions(dimensions: Dimensions) {
    this._dimensions = dimensions;
    this._dots.destroy();
    this._dots.initialise(dimensions);
    this._updateDots();
  }

  _waitForScrollUpTweenToComplete = async () => {
    if (this._scrollUpTween) {
      await tweenComplete(this._scrollUpTween);
    }
  };

  _performFadeOutTween = async () => {
    const valueWrapper = { value: 0 };

    const fadeOutTween = this._scene.tweens.add({
      targets: valueWrapper,
      value: 100,
      ease: "Linear",
      duration: FADE_OUT_DURATION_MS,
      onUpdate: (tween) => {
        const currentStep = tween.getValue() ?? 0;
        const { r, g, b } = Phaser.Display.Color.Interpolate.ColorWithColor(
          onColourObject,
          offColourObject,
          100,
          currentStep,
          true,
        );
        const fillColour = Phaser.Display.Color.GetColor(r, g, b);
        this._updateDots(fillColour);
      },
    });

    await tweenComplete(fadeOutTween);
  };

  _scrollUpNewRow = async (rowDescriptor: RowDescriptor) => {
    this._matrixState.makeRowMatrixWithBlankLine(rowDescriptor);
    this._addScrollUpTween();
    if (this._scrollUpTween) {
      await tweenComplete(this._scrollUpTween);
    }
  };

  async changeRowDescriptor(rowDescriptor: RowDescriptor) {
    if (this._scrollLeftTween) {
      this._scrollLeftTween.pause();
    }
    if (this._alternatingTimer) {
      this._alternatingTimer.remove();
    }
    if (this._cycleTimer) {
      this._cycleTimer.remove();
    }

    await this._waitForScrollUpTweenToComplete();
    await this._performFadeOutTween();
    await this._scrollUpNewRow(rowDescriptor);

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
    this._scrollTweenState.rowOffset = 0;
    this._scrollTweenState.colOffset = 0;
    this._useFirstMessage = true;

    if (this._alternatingTimer) {
      this._alternatingTimer.destroy();
      this._alternatingTimer = null;
    }

    if (this._cycleTimer) {
      this._cycleTimer.destroy();
      this._cycleTimer = null;
    }

    this._stopScrollLeftTween();

    if (this._scrollUpTween) {
      this._scrollUpTween.stop();
      this._scrollUpTween = null;
    }
  };

  _handleOffRow = () => {
    this._matrixState.makeMatrixBlank();
  };

  _handleClockRow = () => {
    if (!this._clockTimer) {
      this._clockTimer = this._scene.time.addEvent({
        delay: CLOCK_DELAY_MS,
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

    this._matrixState.makeMatrixForLayout(
      rowDescriptor.layout,
      this._useFirstMessage,
    );

    if (this._matrixState.needsScrollLeft()) {
      this._addScrollLeftTween();
    }

    if (isAlternatingRow(rowDescriptor)) {
      this._addAlternatingTimer(rowDescriptor);
    }
  };

  _handleCycleRow = (rowDescriptor: RowDescriptor) => {
    if (rowDescriptor.mode !== "cycle") return;

    this._matrixState.makeCycleMatrix(
      rowDescriptor.layouts,
      this._useFirstMessage,
    );

    this._addCycleTimer();

    if (isAlternatingRow(rowDescriptor)) {
      this._addAlternatingTimer(rowDescriptor);
    }
  };

  _addScrollLeftTween = () => {
    this._stopScrollLeftTween();
    this._runScrollLeftTweenCycle();
  };

  _runScrollLeftTweenCycle = () => {
    const startColOffset = this._scrollTweenState.colOffset;
    const targetColOffset = startColOffset + SCROLL_H_COLS_PER_CYCLE;

    this._scrollLeftTween = this._scene.tweens.add({
      targets: this._scrollTweenState,
      colOffset: targetColOffset,
      duration: SCROLL_H_CYCLE_MS,
      ease: "Linear",
      onUpdate: () => {
        this._updateDots();
      },
      onComplete: () => {
        this._scrollTweenState.colOffset = targetColOffset;
        this._scrollLeftTween = null;
        this._runScrollLeftTweenCycle();
      },
    });
  };

  _stopScrollLeftTween = () => {
    if (this._scrollLeftTween) {
      this._scrollLeftTween.stop();
      this._scrollLeftTween = null;
    }
  };

  _addScrollUpTween = () => {
    if (this._scrollUpTween) {
      this._scrollUpTween.stop();
      this._scrollUpTween = null;
    }

    const rowsToScroll = this._dimensions.numRows;
    const startRowOffset = this._scrollTweenState.rowOffset;
    const targetRowOffset = startRowOffset + rowsToScroll;
    const durationMs = (rowsToScroll / SCROLL_V_DOTS_PER_SECOND) * 1_000;

    this._scrollUpTween = this._scene.tweens.add({
      targets: this._scrollTweenState,
      rowOffset: targetRowOffset,
      duration: durationMs,
      ease: "Linear",
      onUpdate: () => {
        this._updateDots();
      },
      onComplete: () => {
        this._scrollTweenState.rowOffset = targetRowOffset;
        this._updateDots();
        this._scrollUpTween = null;
      },
    });
  };

  _addCycleTimer = () => {
    this._cycleTimer = this._scene.time.addEvent({
      delay: CYCLE_DELAY_MS,
      loop: true,
      callback: () => {
        this._addScrollUpTween();
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
          this._matrixState.makeMatrixForLayout(
            rowDescriptor.layout,
            this._useFirstMessage,
          );
        }

        if (isCycle) {
          this._matrixState.makeCycleMatrix(
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
    this._matrixState.makeMatrixCentre(nowFormatted);
  };

  _updateDots = (fillColour?: number) => {
    this._dots.update(
      this._matrixState,
      Math.round(this._scrollTweenState.rowOffset),
      Math.round(this._scrollTweenState.colOffset),
      fillColour,
    );
  };
}
