import Phaser from "phaser";

import { LedMatrixScene, type LedMatrixSceneData } from "./scene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 0x000000,
};

// We need to account for the border width and padding of the parent element
// (i.e. the StyledLedMatrixContainer div) in order to calculate the size of
// the remaining space available for the Phaser canvas:
// * 2 x 10px for the left/right or top/bottom border widths
// * 2 x 10px for the left/right or top/bottom padding
// const FUDGE_FACTOR = 40;
const FUDGE_FACTOR = 0;

export const initialiseGame = (
  parent: HTMLElement,
  initialValues: LedMatrixSceneData,
) => {
  const parentRect = parent.getBoundingClientRect();
  console.log("[initialiseGame]", { parentRect });

  gameConfig.parent = parent;
  gameConfig.width = parentRect.width - FUDGE_FACTOR;
  gameConfig.height = parentRect.height - FUDGE_FACTOR;

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
    const newWidth = parentRect.width - FUDGE_FACTOR;
    const newHeight = parentRect.height - FUDGE_FACTOR;
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

  const setMessage = (message: string) => {
    console.log("[gameActions#setMessage]", message);
    game.events.emit("setMessage", message);
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
    setMessage,
    destroy,
  };
};
