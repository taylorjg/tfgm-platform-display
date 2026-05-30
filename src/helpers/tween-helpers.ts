import * as Phaser from "phaser";

export const tweenComplete = (tween: Phaser.Tweens.Tween): Promise<void> => {
  return new Promise((resolve) => {
    tween.once(Phaser.Tweens.Events.TWEEN_COMPLETE, resolve);
  });
};
