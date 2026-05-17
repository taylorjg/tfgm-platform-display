import { useEffect, useRef } from "react";

import { initialiseGame } from "@app/phaser";
import type { Font } from "@app/fonts";
import type { LedMatrixSceneData } from "@app/phaser/scene";
import type { MessageDescriptor } from "@app/helpers";

export type LedMatrixRowProps = {
  font: Font;
  numCols: number;
  messageDescriptor: MessageDescriptor;
  width: string;
  height: string;
};

export const LedMatrixRow = ({
  font,
  numCols,
  messageDescriptor,
  width,
  height,
}: LedMatrixRowProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const initialValuesRef = useRef<LedMatrixSceneData>({
    font,
    numCols,
    messageDescriptor,
  });
  const gameActionsRef = useRef<{
    setMessageDescriptor: (messageDescriptor: MessageDescriptor) => void;
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
    gameActionsRef.current?.setMessageDescriptor(messageDescriptor);
  }, [messageDescriptor]);

  return <div ref={parentRef} style={{ width, height }} />;
};
