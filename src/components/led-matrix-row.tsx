import { useEffect, useRef } from "react";

import { initialiseGame } from "@app/phaser";
import type { Font } from "@app/fonts";
import type { LedMatrixSceneData } from "@app/phaser/scene";

export type LedMatrixRowProps = {
  font: Font;
  message: string;
  width: string;
  height: string;
  numCols: number;
};

export const LedMatrixRow = ({
  font,
  message,
  width,
  height,
  numCols,
}: LedMatrixRowProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const initialValuesRef = useRef<LedMatrixSceneData>({
    font,
    message,
    numCols,
  });
  const gameActionsRef = useRef<{
    setMessage: (message: string) => void;
    destroy: () => void;
  }>(null);

  useEffect(() => {
    gameActionsRef.current = initialiseGame(
      parentRef.current as HTMLElement,
      initialValuesRef.current,
    );

    return gameActionsRef.current.destroy;
  }, []);

  useEffect(() => {
    gameActionsRef.current?.setMessage(message);
  }, [message]);

  return <div ref={parentRef} style={{ width, height }} />;
};
