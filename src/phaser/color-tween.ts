import Phaser from "phaser";

import { tweenComplete } from "@app/helpers";

export type ColorTweenInput = number | Phaser.Display.Color;

export type ColorTweenConfig = {
  duration: number;
  ease?: string;
  yoyo?: boolean;
  repeat?: number;
  /** Interpolation range upper bound (default 100). */
  steps?: number;
  onUpdate: (color: number) => void;
  onComplete?: () => void;
};

const toColorObject = (input: ColorTweenInput): Phaser.Display.Color =>
  typeof input === "number" ? Phaser.Display.Color.ValueToColor(input) : input;

/** Tween between two colours in RGB space, invoking onUpdate with each fill colour. */
export const tweenColor = (
  scene: Phaser.Scene,
  from: ColorTweenInput,
  to: ColorTweenInput,
  config: ColorTweenConfig
): Phaser.Tweens.Tween => {
  const fromColor = toColorObject(from);
  const toColor = toColorObject(to);
  const steps = config.steps ?? 100;
  const wrapper = { value: 0 };

  return scene.tweens.add({
    targets: wrapper,
    value: steps,
    ease: config.ease ?? "Linear",
    duration: config.duration,
    yoyo: config.yoyo,
    repeat: config.repeat,
    onUpdate: (tween) => {
      const currentStep = tween.getValue() ?? 0;
      const { r, g, b } = Phaser.Display.Color.Interpolate.ColorWithColor(
        fromColor,
        toColor,
        steps,
        currentStep,
        true
      );
      config.onUpdate(Phaser.Display.Color.GetColor(r, g, b));
    },
    onComplete: config.onComplete,
  });
};

/** Like tweenColor but resolves when the tween completes. */
export const tweenColorComplete = (
  scene: Phaser.Scene,
  from: ColorTweenInput,
  to: ColorTweenInput,
  config: ColorTweenConfig
): Promise<void> => tweenComplete(tweenColor(scene, from, to, config));
