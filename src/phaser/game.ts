import Phaser from "phaser";

import { LedMatrixScene } from "./scene";
import type { RowDescriptors } from "@app/helpers";

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  transparent: true,
  scene: [LedMatrixScene],
};

export const initialiseGame = (parent: HTMLElement) => {
  const parentRect = parent.getBoundingClientRect();
  console.log("[initialiseGame]", { parentRect });

  gameConfig.parent = parent;
  gameConfig.width = parentRect.width;
  gameConfig.height = parentRect.height;

  const game = new Phaser.Game(gameConfig);

  return makeGameActions(game);
};

export interface GameActions {
  destroy: () => void;
  changeRowDescriptors: (rowDescriptors: RowDescriptors) => void;
}

const makeGameActions = (game: Phaser.Game): GameActions => {
  const resizeGameToMatchParent = () => {
    const parent = game.config.parent;
    const parentRect = parent.getBoundingClientRect();
    console.log("[resizeGameToMatchParent]", { parentRect });
    const newWidth = parentRect.width;
    const newHeight = parentRect.height;
    game.scale.resize(newWidth, newHeight);
  };

  const onResize = () => {
    console.log("[onResize]");
    resizeGameToMatchParent();
  };

  const onScreenOrientationChange = (e: Event) => {
    console.log(
      "[onScreenOrientationChange]",
      (e.target as ScreenOrientation).type,
    );
    resizeGameToMatchParent();
  };

  window.addEventListener("resize", onResize);
  screen.orientation?.addEventListener("change", onScreenOrientationChange);

  const changeRowDescriptors = (rowDescriptors: RowDescriptors) => {
    console.log("[gameActions#changeRowDescriptors]", rowDescriptors);
    game.events.emit("ChangeRowDescriptors", rowDescriptors);
  };

  const destroy = () => {
    console.log("[gameActions#destroy]");
    window.removeEventListener("resize", onResize);
    screen.orientation?.removeEventListener(
      "change",
      onScreenOrientationChange,
    );
    game.destroy(true);
  };

  return {
    destroy,
    changeRowDescriptors,
  };
};
