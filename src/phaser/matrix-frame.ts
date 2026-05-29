import Phaser from "phaser";

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

/** Light post-bake blur to soften gradient banding on long edges. */
const BORDER_BLUR = {
  quality: 0,
  x: 0.75,
  y: 0.75,
  strength: 0.8,
  steps: 2,
} as const;

type GradientColors = [number, number, number, number];

const fillMitreSegment = (
  graphics: Phaser.GameObjects.Graphics,
  colors: GradientColors,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
) => {
  graphics.fillGradientStyle(...colors);
  graphics.beginPath();
  graphics.moveTo(x0, y0);
  graphics.lineTo(x1, y1);
  graphics.lineTo(x2, y2);
  graphics.lineTo(x3, y3);
  graphics.closePath();
  graphics.fillPath();
};

/** Brushed-aluminium border with 45° mitred inner corners. */
const drawMetallicBorder = (
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  borderWidth: number,
) => {
  const bw = Math.round(borderWidth);
  const right = x + width;
  const bottom = y + height;
  const innerRight = right - bw;
  const innerBottom = bottom - bw;
  const innerLeft = x + bw;
  const innerTop = y + bw;

  fillMitreSegment(
    graphics,
    [0xe8e8f0, 0xb4b4bc, 0x6a6a72, 0x5a5a62],
    x,
    y,
    right,
    y,
    innerRight,
    innerTop,
    innerLeft,
    innerTop,
  );

  fillMitreSegment(
    graphics,
    [0x3a3a42, 0x4a4a52, 0x9898a0, 0x888890],
    right,
    bottom,
    x,
    bottom,
    innerLeft,
    innerBottom,
    innerRight,
    innerBottom,
  );

  fillMitreSegment(
    graphics,
    [0xd4d4dc, 0x484850, 0xacacb4, 0x42424a],
    x,
    bottom,
    x,
    y,
    innerLeft,
    innerTop,
    innerLeft,
    innerBottom,
  );

  fillMitreSegment(
    graphics,
    [0x5c5c64, 0x94949c, 0x505058, 0xc4c4cc],
    right,
    y,
    right,
    bottom,
    innerRight,
    innerBottom,
    innerRight,
    innerTop,
  );
};

/** Black fill for the matrix opening and mitre cutouts beneath each corner diagonal. */
const drawInnerFill = (
  graphics: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  borderWidth: number,
) => {
  const bw = Math.round(borderWidth);
  const right = width;
  const bottom = height;
  const innerRight = right - bw;
  const innerBottom = bottom - bw;

  graphics.fillStyle(0x000000);
  graphics.fillRect(bw, bw, width - 2 * bw, height - 2 * bw);
  graphics.fillTriangle(0, 0, 0, bw, bw, bw);
  graphics.fillTriangle(right, 0, right - bw, bw, right, bw);
  graphics.fillTriangle(0, bottom, 0, innerBottom, bw, innerBottom);
  graphics.fillTriangle(
    right,
    bottom,
    right,
    innerBottom,
    innerRight,
    innerBottom,
  );
};

const SHINE_CONFIG = {
  radius: 0.14,
  scale: 2.4,
  direction: Math.PI / 4,
  duration: 2_000,
  yoyo: true,
  ease: "Sine.easeInOut",
  colorFactor: [0.75, 0.78, 0.95, 0.7] as number[],
} as const;

const shineRestOffset = () => -(SHINE_CONFIG.radius / SHINE_CONFIG.scale);

export class MatrixFrame {
  private readonly _scene: Phaser.Scene;
  private _border?: Phaser.GameObjects.RenderTexture;
  private _borderGraphics?: Phaser.GameObjects.Graphics;
  private _innerGraphics?: Phaser.GameObjects.Graphics;
  private _shine?: Phaser.Types.Actions.AddEffectShineReturn;
  private _isFetching = false;

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  rebuild(layout: FrameLayout) {
    this.destroy();

    const { x, y, width, height, borderWidth } = layout;
    const ss = BORDER_SUPERSAMPLE;
    const texWidth = Math.ceil(width * ss);
    const texHeight = Math.ceil(height * ss);
    const texBorderWidth = borderWidth * ss;

    const borderGraphics = this._scene.make.graphics({}, false);
    drawMetallicBorder(
      borderGraphics,
      0,
      0,
      texWidth,
      texHeight,
      texBorderWidth,
    );
    this._borderGraphics = borderGraphics;

    const innerGraphics = this._scene.make.graphics({}, false);
    drawInnerFill(innerGraphics, texWidth, texHeight, texBorderWidth);
    this._innerGraphics = innerGraphics;

    const border = this._scene.add.renderTexture(x, y, texWidth, texHeight);
    border.setOrigin(0, 0);
    border.setDisplaySize(width, height);
    border.setDepth(FRAME_DEPTH);
    border.clear();
    border.draw(innerGraphics);
    border.draw(borderGraphics);
    border.render();

    border.enableFilters();
    border.filters!.internal.addBlur(
      BORDER_BLUR.quality,
      BORDER_BLUR.x,
      BORDER_BLUR.y,
      BORDER_BLUR.strength,
      undefined,
      BORDER_BLUR.steps,
    );

    this._border = border;
    this._setupShine(border, width, height);
    this.setFetching(this._isFetching);
  }

  setFetching(isFetching: boolean) {
    this._isFetching = isFetching;

    if (!this._shine) return;

    const { tween, gradient, dynamicTexture } = this._shine;

    if (isFetching) {
      tween.restart();
      return;
    }

    tween.pause();
    gradient.offset = shineRestOffset();
    dynamicTexture.clear().draw(gradient).render();
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
    this._shine = undefined;
    this._border?.destroy();
    this._border = undefined;

    this._borderGraphics?.destroy();
    this._borderGraphics = undefined;

    this._innerGraphics?.destroy();
    this._innerGraphics = undefined;
  }
}
