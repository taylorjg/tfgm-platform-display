import { useEffect, useRef } from "react";

import { initialiseGame } from "@app/phaser";
import type { Font } from "@app/fonts";
import type { LedMatrixSceneData } from "@app/phaser/scene";

export type LedMatrixTestProps = {
  message: string;
  font: Font;
  width: string;
  height: string;
  numCols: number;
};

export const LedMatrixTest = ({
  message,
  font,
  width,
  height,
  numCols,
}: LedMatrixTestProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const initialValuesRef = useRef<LedMatrixSceneData>({
    message,
    font,
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
