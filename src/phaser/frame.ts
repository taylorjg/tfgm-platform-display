import Phaser from "phaser";

import { frameSupportsFilters } from "./frame-filter-capability";

export type FrameLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderWidth: number;
};

const FRAME_DEPTH = -10;

/** Supersample factor when baking the border into a texture (reduces aliasing). */
const BORDER_SUPERSAMPLE = 4;
const BORDER_SUPERSAMPLE_TOUCH = 2;

/** Flat metallic frame — shine comes from AddEffectShine during fetches. */
const FRAME_FILL = 0xa8a8b0;

const drawFrame = (
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  borderWidth: number,
) => {
  const bw = Math.round(borderWidth);

  graphics.fillStyle(FRAME_FILL);
  graphics.fillRect(x, y, width, height);

  graphics.fillStyle(0x000000);
  graphics.fillRect(x + bw, y + bw, width - 2 * bw, height - 2 * bw);
};

const SHINE_CONFIG = {
  radius: 0.14,
  scale: 2.4,
  direction: Math.PI / 4,
  duration: 4_000,
  yoyo: true,
  ease: "Sine.easeInOut",
  colorFactor: [0.75, 0.78, 0.95, 0.7] as number[],
} as const;

const shineRestOffset = () => -(SHINE_CONFIG.radius / SHINE_CONFIG.scale);

/** Keep fetch feedback visible at least this long once started (ms). */
const SHINE_MIN_VISIBLE_MS = 4_000;

const borderSupersample = (scene: Phaser.Scene) =>
  frameSupportsFilters(scene) ? BORDER_SUPERSAMPLE : BORDER_SUPERSAMPLE_TOUCH;

export class Frame {
  private readonly _scene: Phaser.Scene;
  private _border?: Phaser.GameObjects.RenderTexture;
  private _borderGraphics?: Phaser.GameObjects.Graphics;
  private _shine?: Phaser.Types.Actions.AddEffectShineReturn;
  private _fetchAlphaTween?: Phaser.Tweens.Tween;
  private _fetchShineStopTimer?: Phaser.Time.TimerEvent;
  private _fetchShineStartedAt = 0;
  private _isFetching = false;

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  rebuild(layout: FrameLayout) {
    this.destroy();

    const { x, y, width, height, borderWidth } = layout;
    const ss = borderSupersample(this._scene);
    const texWidth = Math.ceil(width * ss);
    const texHeight = Math.ceil(height * ss);
    const texBorderWidth = borderWidth * ss;

    const borderGraphics = this._scene.make.graphics({}, false);
    drawFrame(borderGraphics, 0, 0, texWidth, texHeight, texBorderWidth);
    this._borderGraphics = borderGraphics;

    const border = this._scene.add.renderTexture(x, y, texWidth, texHeight);
    border.setOrigin(0, 0);
    border.setDisplaySize(width, height);
    border.setDepth(FRAME_DEPTH);
    border.clear();
    border.draw(borderGraphics);
    border.render();

    if (frameSupportsFilters(this._scene)) {
      border.enableFilters();
      this._setupShine(border, width, height);
    }

    this._border = border;
    this.setIsFetching(this._isFetching);
  }

  setIsFetching(isFetching: boolean) {
    this._isFetching = isFetching;

    if (isFetching) {
      this._startFetchShineAnimation();
      return;
    }

    if (this._fetchShineStartedAt === 0) {
      this._stopFetchShineAnimation();
      return;
    }

    const elapsed = this._scene.time.now - this._fetchShineStartedAt;
    const remaining = Math.max(0, SHINE_MIN_VISIBLE_MS - elapsed);

    this._clearFetchShineStopTimer();

    if (remaining === 0) {
      this._stopFetchShineAnimation();
      return;
    }

    this._fetchShineStopTimer = this._scene.time.delayedCall(
      remaining,
      this._stopFetchShineAnimation,
      undefined,
      this,
    );
  }

  private _clearFetchShineStopTimer() {
    this._fetchShineStopTimer?.remove();
    this._fetchShineStopTimer = undefined;
  }

  private _startFetchShineAnimation() {
    this._clearFetchShineStopTimer();
    this._fetchShineStartedAt = this._scene.time.now;

    if (this._shine) {
      this._shine.tween.restart();
      return;
    }

    if (!this._border) return;

    this._fetchAlphaTween?.stop();
    this._border.setAlpha(1);
    this._fetchAlphaTween = this._scene.tweens.add({
      targets: this._border,
      alpha: { from: 1, to: 0.55 },
      duration: 900,
      yoyo: true,
      ease: "Sine.easeInOut",
    });
  }

  private _stopFetchShineAnimation() {
    this._clearFetchShineStopTimer();
    this._fetchShineStartedAt = 0;

    if (this._shine) {
      const { tween, gradient, dynamicTexture } = this._shine;
      tween.pause();
      gradient.offset = shineRestOffset();
      dynamicTexture.clear().draw(gradient).render();
      return;
    }

    this._fetchAlphaTween?.stop();
    this._fetchAlphaTween = undefined;
    this._border?.setAlpha(1);
  }

  private _setupShine(
    border: Phaser.GameObjects.RenderTexture,
    width: number,
    height: number,
  ) {
    const [shine] = Phaser.Actions.AddEffectShine(border, {
      width,
      height,
      ...SHINE_CONFIG,
    });
    this._shine = shine;
    shine.tween.pause();
    shine.gradient.offset = shineRestOffset();
    shine.dynamicTexture.clear().draw(shine.gradient).render();
  }

  destroy() {
    this._clearFetchShineStopTimer();
    this._fetchShineStartedAt = 0;
    this._fetchAlphaTween?.stop();
    this._fetchAlphaTween = undefined;
    this._shine = undefined;
    this._border?.destroy();
    this._border = undefined;

    this._borderGraphics?.destroy();
    this._borderGraphics = undefined;
  }
}
