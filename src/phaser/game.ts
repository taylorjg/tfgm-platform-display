import Phaser from "phaser";

import { LedMatrixScene, type LedMatrixSceneData } from "./scene";
import type { MessageDescriptor } from "@app/helpers";

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 0x000000,
};

export const initialiseGame = (
  parent: HTMLElement,
  initialValues: LedMatrixSceneData,
) => {
  const parentRect = parent.getBoundingClientRect();
  console.log("[initialiseGame]", { parentRect });

  gameConfig.parent = parent;
  gameConfig.width = parentRect.width;
  gameConfig.height = parentRect.height;

  const game = new Phaser.Game(gameConfig);

  game.scene.add("LedMatrixScene", LedMatrixScene, true, initialValues);

  const gameActions = makeGameActions(game);

  return gameActions;
};

const makeGameActions = (game: Phaser.Game) => {
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

  const setMessageDescriptor = (messageDescriptor: MessageDescriptor) => {
    console.log("[gameActions#setMessageDescriptor]", messageDescriptor);
    game.events.emit("SetMessageDescriptor", messageDescriptor);
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
    setMessageDescriptor,
    destroy,
  };
};
