import Phaser from "phaser";

import { type Font } from "@app/fonts";
import {
  formatTime,
  type MessageDescriptor,
  makeMatrixBlank,
  makeCycleMatrix,
  makeMatrixForLayout,
  makeMatrixCentre,
} from "@app/helpers";
import { first } from "@app/utils";

import { Dots, type Dimensions } from "./dots";

export type { Dimensions } from "./dots";

export type LedMatrixSceneData = {
  font: Font;
  numCols: number;
  messageDescriptor: MessageDescriptor;
};

const FPS = 60;
const SCROLL_LEFT_DELAY_MS = 1_000 / FPS;
const SCROLL_LEFT_DOTS_PER_SECOND = 50;
const SCROLL_LEFT_DOTS_PER_MS = SCROLL_LEFT_DOTS_PER_SECOND / 1_000;
const ALTERNATING_DELAY_MS = 2_000;
const CYCLE_DELAY_MS = 4_000;

export class LedMatrixScene extends Phaser.Scene {
  private _font!: Font;
  private _messageDescriptor!: MessageDescriptor;
  private _dimensions!: Dimensions;
  private _matrix!: string[];
  private _dots!: Dots;
  private _includeFirstColon = false;
  private _alternatingTimer: Phaser.Time.TimerEvent | null = null;
  private _cycleTimer: Phaser.Time.TimerEvent | null = null;
  private _scrollUpTimer: Phaser.Time.TimerEvent | null = null;
  private _scrollLeftTimer: Phaser.Time.TimerEvent | null = null;
  private _scrollLeftPrevMs = 0;
  private _rowOffset = 0;
  private _colOffset = 0;
  private _useFirstMessage = true;

  constructor() {
    console.log("[LedMatrixScene#constructor]");
    super("LedMatrixScene");
  }

  create(data: LedMatrixSceneData) {
    console.log("[LedMatrixScene#create]", data);

    this._font = data.font;
    this._messageDescriptor = data.messageDescriptor;
    this._matrix = makeMatrixBlank(this._font, data.numCols);

    this._dots = new Dots(this);
    this._onResize(data.numCols);

    this.game.events.on(
      "SetMessageDescriptor",
      this._onSetMessageDescriptor,
      this,
    );

    if (this._messageDescriptor.mode === "clock") {
      this.time.addEvent({
        delay: 500,
        loop: true,
        callback: this._updateClock,
      });
    } else {
      this._onSetMessageDescriptor(this._messageDescriptor);
    }
  }

  _updateClock = () => {
    this._includeFirstColon = !this._includeFirstColon;
    const now = new Date();
    const nowFormatted = formatTime(now, this._includeFirstColon);
    this._matrix = makeMatrixCentre(
      this._font,
      this._dimensions.numCols,
      nowFormatted,
    );
    this._updateDots();
  };

  _onSetMessageDescriptor = (messageDescriptor: MessageDescriptor) => {
    console.log("[LedMatrixScene#_onSetMessageDescriptor]", messageDescriptor);

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

    if (this._scrollUpTimer) {
      this._scrollUpTimer.destroy();
      this._scrollUpTimer = null;
    }

    if (this._scrollLeftTimer) {
      this._scrollLeftTimer.destroy();
      this._scrollLeftTimer = null;
    }

    if (messageDescriptor.mode === "off") {
      this._dots.reset();
      return;
    }

    if (messageDescriptor.mode === "clock") {
      // In clock mode, _updateClock() is invoked by update()
      return;
    }

    if (messageDescriptor.mode === "single") {
      this._matrix = makeMatrixForLayout(
        this._font,
        this._dimensions.numCols,
        messageDescriptor.layout,
        this._useFirstMessage,
      );
    }

    if (messageDescriptor.mode === "cycle") {
      this._matrix = makeCycleMatrix(
        this._font,
        this._dimensions.numCols,
        messageDescriptor.layouts,
        this._useFirstMessage,
      );
    }

    const firstLine = first(this._matrix) ?? "";
    const contentCols = firstLine.length;
    const { numCols } = this._dimensions;

    if (contentCols > numCols) {
      this._scrollLeftPrevMs = Date.now();
      this._scrollLeftTimer = this.time.addEvent({
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

    this._updateDots();

    const isAlternating = (messageDescriptor: MessageDescriptor) =>
      (messageDescriptor.mode === "single" &&
        messageDescriptor.layout.type === "alternating") ||
      (messageDescriptor.mode === "cycle" &&
        messageDescriptor.layouts.some(
          (layout) => layout.type === "alternating",
        ));

    if (
      messageDescriptor.mode === "single" ||
      messageDescriptor.mode === "cycle"
    ) {
      this._alternatingTimer = this.time.addEvent({
        delay: ALTERNATING_DELAY_MS,
        loop: true,
        callback: () => {
          this._useFirstMessage = !this._useFirstMessage;

          if (
            messageDescriptor.mode === "single" &&
            isAlternating(messageDescriptor)
          ) {
            this._matrix = makeMatrixForLayout(
              this._font,
              this._dimensions.numCols,
              messageDescriptor.layout,
              this._useFirstMessage,
            );
          }

          if (
            messageDescriptor.mode === "cycle" &&
            isAlternating(messageDescriptor)
          ) {
            this._matrix = makeCycleMatrix(
              this._font,
              this._dimensions.numCols,
              messageDescriptor.layouts,
              this._useFirstMessage,
            );
          }

          this._updateDots();
        },
      });
    }

    if (messageDescriptor.mode === "cycle") {
      this._cycleTimer = this.time.addEvent({
        delay: CYCLE_DELAY_MS,
        loop: true,
        callback: () => {
          if (this._scrollUpTimer) {
            this._scrollUpTimer.destroy();
          }
          this._scrollUpTimer = this.time.addEvent({
            delay: 50,
            repeat: this._dimensions.numRows - 1,
            callback: () => {
              this._rowOffset++;
              this._updateDots();
            },
          });
        },
      });
    }
  };

  _onResize = (numCols: number) => {
    console.log("[LedMatrixScene#_onResize]");

    this._dots.destroy();

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

    this._dimensions = {
      radius,
      diameter,
      gap,
      numRows,
      numCols,
      marginX,
      marginY,
    };

    this._dots.initialise(this._dimensions);
    this._updateDots();
  };

  _updateDots = () => {
    this._dots.update(this._matrix, this._rowOffset, this._colOffset);
  };
}
