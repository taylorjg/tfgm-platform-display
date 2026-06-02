import Phaser from "phaser";

import type { RowDescriptors } from "@app/helpers";

import { PlatformDisplayScene } from "./platform-display-scene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  transparent: true,
  antialias: true,
  scene: [PlatformDisplayScene],
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
  changeRowDescriptors: (
    rowDescriptors: RowDescriptors,
    onlyDueValuesHaveChanged: boolean,
  ) => void;
  setIsFetching: (isFetching: boolean) => void;
}

const makeGameActions = (game: Phaser.Game): GameActions => {
  const resizeGameToMatchParent = () => {
    const parent = game.config.parent;
    if (!parent || typeof parent === "string") return;

    const parentRect = parent.getBoundingClientRect();
    const newWidth = Math.round(parentRect.width);
    const newHeight = Math.round(parentRect.height);

    if (newWidth <= 0 || newHeight <= 0) return;

    const { width, height } = game.scale;
    if (width === newWidth && height === newHeight) return;

    console.log("[resizeGameToMatchParent]", {
      parentRect,
      newWidth,
      newHeight,
    });
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

  const changeRowDescriptors = (
    rowDescriptors: RowDescriptors,
    onlyDueValuesHaveChanged: boolean,
  ) => {
    console.log("[gameActions#changeRowDescriptors]", {
      rowDescriptors,
      onlyDueValuesHaveChanged,
    });

    game.events.emit(
      "ChangeRowDescriptors",
      rowDescriptors,
      onlyDueValuesHaveChanged,
    );
  };

  const setIsFetching = (isFetching: boolean) => {
    game.events.emit("FetchingStateChanged", isFetching);
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
    setIsFetching,
  };
};
