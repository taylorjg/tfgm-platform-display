import Phaser from "phaser";

/** Bump when probe logic changes so cached results are discarded. */
const CACHE_KEY = "tfgm-frame-filters-v3";

/** Same fill as the display frame — probe must mirror production. */
const PROBE_FRAME_FILL = 0xa8a8b0;

/** Shine settings aligned with frame.ts SHINE_CONFIG. */
const PROBE_SHINE_CONFIG = {
  radius: 0.14,
  scale: 2.4,
  direction: Math.PI / 4,
  duration: 99_999,
  colorFactor: [0.75, 0.78, 0.95, 0.7] as number[],
} as const;

const PROBE_SIZE = 32;
const PROBE_PIXEL = PROBE_SIZE / 2;
const PROBE_ORIGIN = 8;
const MIN_COLOR_DELTA = 6;

/** Offsets to try — highlight may miss a single sample point. */
const PROBE_SHINE_OFFSETS = [0.15, 0.45, 0.75, 1.05] as const;

export type FrameFilterPixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type FrameFilterProbeResult = {
  supported: boolean;
  delta: number;
  baseline: FrameFilterPixel;
  after: FrameFilterPixel;
  touch: boolean;
  maxTouchPoints: number;
  renderer?: string;
  cached: boolean;
  reason?:
    | "confirmed"
    | "broken"
    | "inconclusive-desktop"
    | "inconclusive-touch"
    | "invalid-baseline";
};

let cachedSupportsFilters: boolean | undefined;
let lastProbeResult: FrameFilterProbeResult | undefined;

const colorDelta = (a: FrameFilterPixel, b: FrameFilterPixel) =>
  Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);

const toPixel = (color: Phaser.Display.Color): FrameFilterPixel => ({
  r: color.red,
  g: color.green,
  b: color.blue,
  a: color.alpha,
});

const waitPostRender = (game: Phaser.Game) =>
  new Promise<void>((resolve) => {
    game.events.once(Phaser.Core.Events.POST_RENDER, resolve);
  });

const snapshotViewportPixel = (game: Phaser.Game, x: number, y: number) =>
  new Promise<Phaser.Display.Color>((resolve) => {
    game.renderer.snapshotPixel(x, y, (color) => {
      resolve(color as Phaser.Display.Color);
    });
  });

const readWebGlRenderer = (game: Phaser.Game): string | undefined => {
  if (game.renderer.type !== Phaser.WEBGL) return undefined;

  const gl = (game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).gl;
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) return "WebGL (renderer masked)";

  return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
};

const readCache = (): boolean | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { supported?: boolean };
    return typeof parsed.supported === "boolean" ? parsed.supported : null;
  } catch {
    return null;
  }
};

const writeCache = (supported: boolean) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ supported }));
  } catch {
    // Private browsing or storage quota — probe still works this session.
  }
};

const isFrameProbeDebug = () =>
  new URLSearchParams(window.location.search).has("frameProbe");

const logProbeResult = (result: FrameFilterProbeResult) => {
  console.log("[frame-filter-capability]", {
    supported: result.supported,
    path: result.supported ? "shine" : "alpha-pulse",
    reason: result.reason,
    delta: result.delta,
    baseline: result.baseline,
    after: result.after,
    touch: result.touch,
    maxTouchPoints: result.maxTouchPoints,
    renderer: result.renderer,
    cached: result.cached,
  });
};

/** Whether the frame can use AddEffectShine (set after initFrameFilterCapability). */
export const frameSupportsFilters = (scene: Phaser.Scene): boolean =>
  cachedSupportsFilters ?? !scene.game.device.input.touch;

export const getFrameFilterProbeResult = () => lastProbeResult;

const interpretProbeSupport = (
  scene: Phaser.Scene,
  baseline: FrameFilterPixel,
  bestAfter: FrameFilterPixel,
  maxDelta: number
): Pick<FrameFilterProbeResult, "supported" | "reason"> => {
  const touch = scene.game.device.input.touch;
  const baselineVisible = baseline.a >= 32;

  if (!baselineVisible) {
    return {
      supported: !touch,
      reason: "invalid-baseline",
    };
  }

  const compositingBroken = bestAfter.a < 32;
  const compositingConfirmed =
    maxDelta >= MIN_COLOR_DELTA &&
    bestAfter.a >= Math.max(16, baseline.a * 0.4);

  if (compositingBroken) {
    return { supported: false, reason: "broken" };
  }

  if (compositingConfirmed) {
    return { supported: true, reason: "confirmed" };
  }

  // Filters ran but the sample pixel barely moved — trust desktop, not touch.
  return {
    supported: !touch,
    reason: touch ? "inconclusive-touch" : "inconclusive-desktop",
  };
};

const probeResultFromSamples = (
  scene: Phaser.Scene,
  baseline: FrameFilterPixel,
  bestAfter: FrameFilterPixel,
  maxDelta: number
): FrameFilterProbeResult => {
  const { supported, reason } = interpretProbeSupport(
    scene,
    baseline,
    bestAfter,
    maxDelta
  );

  return {
    supported,
    delta: maxDelta,
    baseline,
    after: bestAfter,
    touch: scene.game.device.input.touch,
    maxTouchPoints: navigator.maxTouchPoints,
    renderer: readWebGlRenderer(scene.game),
    cached: false,
    reason,
  };
};

const runProbe = async (
  scene: Phaser.Scene
): Promise<FrameFilterProbeResult> => {
  const { game } = scene;
  const probeX = PROBE_ORIGIN;
  const probeY = PROBE_ORIGIN;
  const sampleX = probeX + PROBE_PIXEL;
  const sampleY = probeY + PROBE_PIXEL;

  const rt = scene.add.renderTexture(probeX, probeY, PROBE_SIZE, PROBE_SIZE);
  rt.setOrigin(0, 0);
  rt.setDepth(10_000);

  try {
    const graphics = scene.make.graphics({}, false);
    graphics.fillStyle(PROBE_FRAME_FILL);
    graphics.fillRect(0, 0, PROBE_SIZE, PROBE_SIZE);
    rt.draw(graphics).render();
    graphics.destroy();

    await waitPostRender(game);
    const baseline = toPixel(
      await snapshotViewportPixel(game, sampleX, sampleY)
    );

    rt.enableFilters();
    const [shine] = Phaser.Actions.AddEffectShine(rt, {
      width: PROBE_SIZE,
      height: PROBE_SIZE,
      ...PROBE_SHINE_CONFIG,
    });

    shine.tween.pause();

    let maxDelta = 0;
    let bestAfter = baseline;

    for (const offset of PROBE_SHINE_OFFSETS) {
      shine.gradient.offset = offset;
      shine.dynamicTexture.clear().draw(shine.gradient).render();

      await waitPostRender(game);
      const sample = toPixel(
        await snapshotViewportPixel(game, sampleX, sampleY)
      );
      const delta = colorDelta(baseline, sample);

      if (delta > maxDelta) {
        maxDelta = delta;
        bestAfter = sample;
      }
    }

    return probeResultFromSamples(scene, baseline, bestAfter, maxDelta);
  } finally {
    // AddEffectShine registers a DESTROY handler that tears down tween +
    // dynamic texture — only destroy the RT and let that handler run once.
    if (rt.scene) {
      rt.destroy();
    }
  }
};

/** Probe RenderTexture filter compositing once; caches result for the session. */
export const initFrameFilterCapability = async (
  scene: Phaser.Scene
): Promise<boolean> => {
  const debug = isFrameProbeDebug();
  const cached = debug ? null : readCache();

  if (cached !== null) {
    cachedSupportsFilters = cached;
    lastProbeResult = {
      supported: cached,
      delta: -1,
      baseline: { r: 0, g: 0, b: 0, a: 0 },
      after: { r: 0, g: 0, b: 0, a: 0 },
      touch: scene.game.device.input.touch,
      maxTouchPoints: navigator.maxTouchPoints,
      renderer: readWebGlRenderer(scene.game),
      cached: true,
      reason: undefined,
    };

    if (debug) logProbeResult(lastProbeResult);
    return cached;
  }

  let result: FrameFilterProbeResult;

  try {
    result = await runProbe(scene);
  } catch (error) {
    console.warn(
      "[frame-filter-capability] probe failed; using alpha pulse",
      error
    );
    result = {
      supported: !scene.game.device.input.touch,
      delta: 0,
      baseline: { r: 0, g: 0, b: 0, a: 0 },
      after: { r: 0, g: 0, b: 0, a: 0 },
      touch: scene.game.device.input.touch,
      maxTouchPoints: navigator.maxTouchPoints,
      renderer: readWebGlRenderer(scene.game),
      cached: false,
      reason: scene.game.device.input.touch
        ? "inconclusive-touch"
        : "inconclusive-desktop",
    };
  }

  cachedSupportsFilters = result.supported;
  lastProbeResult = result;
  writeCache(result.supported);

  if (debug) logProbeResult(result);

  return result.supported;
};
