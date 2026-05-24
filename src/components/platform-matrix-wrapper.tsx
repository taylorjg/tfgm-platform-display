import { useEffect, useRef } from "react";

import { initialiseGame2 } from "@app/phaser";
import type { LedMatrixScene2Data } from "@app/phaser/scene2";

export const PlatformMatrixWrapper = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const initialValuesRef = useRef<LedMatrixScene2Data>({});
  const gameActionsRef = useRef<{
    destroy: () => void;
  }>(null);

  useEffect(() => {
    gameActionsRef.current = initialiseGame2(
      parentRef.current as HTMLElement,
      initialValuesRef.current,
    );

    return gameActionsRef.current.destroy;
  }, []);

  return <div ref={parentRef} style={{ aspectRatio: "201/58" }} />;
};
